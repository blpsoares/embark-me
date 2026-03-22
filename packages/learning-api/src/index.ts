import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";

// ── Types ──

interface Env {
  NOTION_TOKEN: string;
  NOTION_SIMULADOS_DB_ID: string;
  NOTION_PERGUNTAS_DB_ID: string;
  ALLOWED_ORIGIN: string;
  CACHE_TTL: string;
}

interface LocalizedText {
  pt: string;
  en: string;
}

interface QuizManifestEntry {
  id: string;
  type: string;
  title: LocalizedText;
  description: LocalizedText;
  icon: string;
  tags: string[];
  file: string;
  questionCount: number;
}

interface MultipleChoiceOption {
  opcao: string;
  descricao: string;
}

// ── Notion helpers ──

function getTitle(page: PageObjectResponse): string {
  for (const prop of Object.values(page.properties)) {
    if (prop.type === "title") {
      return prop.title.map((t) => t.plain_text).join("") || "";
    }
  }
  return "";
}

function getRichText(page: PageObjectResponse, name: string): string {
  const prop = page.properties[name];
  if (prop?.type === "rich_text") {
    return prop.rich_text.map((t) => t.plain_text).join("") || "";
  }
  return "";
}

function getSelect(page: PageObjectResponse, name: string): string {
  const prop = page.properties[name];
  if (prop?.type === "select" && prop.select) {
    return prop.select.name;
  }
  return "";
}

function getCheckbox(page: PageObjectResponse, name: string): boolean {
  const prop = page.properties[name];
  if (prop?.type === "checkbox") {
    return prop.checkbox;
  }
  return false;
}

function getMultiSelect(page: PageObjectResponse, name: string): string[] {
  const prop = page.properties[name];
  if (prop?.type === "multi_select") {
    return prop.multi_select.map((s) => s.name);
  }
  return [];
}


function getRelationIds(page: PageObjectResponse, name: string): string[] {
  const prop = page.properties[name];
  if (prop?.type === "relation") {
    return prop.relation.map((r) => r.id);
  }
  return [];
}

// ── Notion client + queries ──

function createNotion(env: Env): Client {
  return new Client({ auth: env.NOTION_TOKEN });
}

async function queryAllPages(
  notion: Client,
  databaseId: string,
  filter?: Parameters<Client["databases"]["query"]>[0]["filter"],
  sorts?: Parameters<Client["databases"]["query"]>[0]["sorts"],
): Promise<PageObjectResponse[]> {
  const pages: PageObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response: QueryDatabaseResponse = await notion.databases.query({
      database_id: databaseId,
      filter,
      sorts,
      start_cursor: cursor,
    });
    for (const page of response.results) {
      if (page.object === "page" && "properties" in page) {
        pages.push(page as PageObjectResponse);
      }
    }
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return pages;
}

// ── GET /api/quizzes ──

async function handleGetQuizzes(env: Env): Promise<QuizManifestEntry[]> {
  const notion = createNotion(env);

  const [simulados, perguntas] = await Promise.all([
    queryAllPages(notion, env.NOTION_SIMULADOS_DB_ID, {
      property: "Ativo",
      checkbox: { equals: true },
    }),
    queryAllPages(notion, env.NOTION_PERGUNTAS_DB_ID),
  ]);

  // Count questions per simulado
  const countMap = new Map<string, number>();
  for (const p of perguntas) {
    const relIds = getRelationIds(p, "Simulado");
    for (const id of relIds) {
      countMap.set(id, (countMap.get(id) ?? 0) + 1);
    }
  }

  return simulados.map((page) => {
    const nome = getTitle(page);
    const nomeEn = getRichText(page, "Nome (EN)");
    const descricao = getRichText(page, "Descrição");
    const descricaoEn = getRichText(page, "Descrição (EN)");

    return {
      id: page.id,
      type: getSelect(page, "Tipo"),
      title: { pt: nome, en: nomeEn || nome },
      description: { pt: descricao, en: descricaoEn || descricao },
      icon: getSelect(page, "Ícone") || "book-open",
      tags: getMultiSelect(page, "Tags"),
      file: `notion:${page.id}`,
      questionCount: countMap.get(page.id) ?? 0,
    };
  });
}

// ── GET /api/quizzes/:id ──

async function handleGetQuiz(env: Env, simuladoId: string): Promise<Record<string, unknown>> {
  const notion = createNotion(env);

  // Get simulado info
  const simuladoPage = await notion.pages.retrieve({ page_id: simuladoId });
  if (!("properties" in simuladoPage)) {
    throw new Error("Simulado not found");
  }
  const tipo = getSelect(simuladoPage as PageObjectResponse, "Tipo");

  // Get perguntas for this simulado
  const perguntas = await queryAllPages(
    notion,
    env.NOTION_PERGUNTAS_DB_ID,
    {
      property: "Simulado",
      relation: { contains: simuladoId },
    },
    [{ property: "Ordem", direction: "ascending" }],
  );

  switch (tipo) {
    case "flashcard":
      return buildFlashcard(perguntas);
    case "multiple-choice":
      return buildMultipleChoice(perguntas);
    case "true-false":
      return buildTrueFalse(perguntas);
    case "fill-blank":
      return buildFillBlank(perguntas);
    case "match-pairs":
      return buildMatchPairs(perguntas);
    default:
      throw new Error(`Unknown quiz type: ${tipo}`);
  }
}

function buildFlashcard(perguntas: PageObjectResponse[]): Record<string, unknown> {
  return {
    type: "flashcard",
    questions: perguntas.map((p) => ({
      pergunta: getTitle(p),
      resposta: getRichText(p, "Resposta"),
    })),
  };
}

function buildMultipleChoice(
  perguntas: PageObjectResponse[],
): Record<string, unknown> {
  const optionLetters = ["A", "B", "C", "D", "E"];

  return {
    type: "multiple-choice",
    questions: perguntas.map((p) => {
      const opcoes: MultipleChoiceOption[] = [];
      for (const letter of optionLetters) {
        const descricao = getRichText(p, `Opção ${letter}`);
        if (descricao) {
          opcoes.push({ opcao: letter, descricao });
        }
      }

      return {
        pergunta: getTitle(p),
        resposta: getRichText(p, "Resposta").toUpperCase(),
        opcoes,
      };
    }),
  };
}

function buildTrueFalse(perguntas: PageObjectResponse[]): Record<string, unknown> {
  return {
    type: "true-false",
    questions: perguntas.map((p) => {
      const explicacao = getRichText(p, "Explicação");
      return {
        pergunta: getTitle(p),
        resposta: getCheckbox(p, "Resposta Correta"),
        ...(explicacao ? { explicacao } : {}),
      };
    }),
  };
}

function buildFillBlank(perguntas: PageObjectResponse[]): Record<string, unknown> {
  return {
    type: "fill-blank",
    questions: perguntas.map((p) => {
      const alternativasRaw = getRichText(p, "Alternativas Aceitas");
      const alternativas = alternativasRaw
        ? alternativasRaw.split(",").map((a) => a.trim()).filter(Boolean)
        : undefined;
      return {
        pergunta: getTitle(p),
        resposta: getRichText(p, "Resposta"),
        ...(alternativas?.length ? { alternativas } : {}),
      };
    }),
  };
}

function buildMatchPairs(perguntas: PageObjectResponse[]): Record<string, unknown> {
  return {
    type: "match-pairs",
    questions: [
      {
        pairs: perguntas.map((p) => ({
          termo: getTitle(p),
          definicao: getRichText(p, "Resposta"),
        })),
      },
    ],
  };
}

// ── Router ──

function corsHeaders(env: Env): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function jsonResponse(data: unknown, env: Env, status = 200): Response {
  const cacheTtl = parseInt(env.CACHE_TTL, 10) || 300;
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": `public, max-age=${cacheTtl}`,
      ...corsHeaders(env),
    },
  });
}

function errorResponse(message: string, env: Env, status = 500): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(env),
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }

    if (request.method !== "GET") {
      return errorResponse("Method not allowed", env, 405);
    }

    // Server-side cache (Cloudflare Cache API)
    const cache = caches.default;
    const cacheKey = new Request(url.toString(), request);
    const cached = await cache.match(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      let response: Response;

      // GET /api/quizzes
      if (path === "/api/quizzes") {
        const quizzes = await handleGetQuizzes(env);
        response = jsonResponse({ quizzes }, env);
      }
      // GET /api/quizzes/:id
      else {
        const match = path.match(/^\/api\/quizzes\/([a-f0-9-]+)$/);
        if (match?.[1]) {
          const data = await handleGetQuiz(env, match[1]);
          response = jsonResponse(data, env);
        } else {
          return errorResponse("Not found", env, 404);
        }
      }

      // Store in edge cache
      request.cf && response.headers.get("Cache-Control") &&
        await cache.put(cacheKey, response.clone());

      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Internal server error";
      console.error("Worker error:", message);
      return errorResponse(message, env, 502);
    }
  },
};
