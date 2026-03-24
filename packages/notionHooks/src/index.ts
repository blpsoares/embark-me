interface Env {
  DISCORD_WEBHOOK_URL: string;
  AUTH_TOKEN: string;
}

interface NotionPage {
  object: string;
  id: string;
  properties: {
    Nome?: {
      type: "title";
      title: Array<{ plain_text: string }>;
    };
    "Descrição"?: {
      type: "rich_text";
      rich_text: Array<{ plain_text: string }>;
    };
    "Data e Hora"?: {
      type: "date";
      date: { start: string; end: string | null } | null;
    };
    Tipo?: {
      type: "select";
      select: { name: string } | null;
    };
    "Área"?: {
      type: "select";
      select: { name: string } | null;
    };
    Status?: {
      type: "select";
      select: { name: string } | null;
    };
    "Concluído"?: {
      type: "checkbox";
      checkbox: boolean;
    };
  };
  url: string;
}

interface NotionWebhookBody {
  source: {
    type: string;
    automation_id: string;
    event_id: string;
  };
  data: NotionPage;
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
}

function buildDiscordEmbed(page: NotionPage) {
  const title =
    page.properties.Nome?.title.map((t) => t.plain_text).join("") ||
    "Sem título";
  const description =
    page.properties["Descrição"]?.rich_text
      .map((t) => t.plain_text)
      .join("") || "";
  const tipo = page.properties.Tipo?.select?.name || "—";
  const area = page.properties["Área"]?.select?.name || "—";
  const status = page.properties.Status?.select?.name || "—";
  const concluido = page.properties["Concluído"]?.checkbox ? "✅" : "❌";
  const dataHora = page.properties["Data e Hora"]?.date?.start;

  const fields = [
    { name: "Tipo", value: tipo, inline: true },
    { name: "Área", value: area, inline: true },
    { name: "Status", value: status, inline: true },
    { name: "Concluído", value: concluido, inline: true },
  ];

  if (dataHora) {
    fields.push({
      name: "Data e Hora",
      value: formatDate(dataHora),
      inline: true,
    });
  }

  return {
    embeds: [
      {
        title,
        description: description || undefined,
        url: page.url,
        color: 0x2f3136,
        fields,
        timestamp: new Date().toISOString(),
        footer: { text: "Notion Automation" },
      },
    ],
  };
}

async function sendDiscordNotification(
  webhookUrl: string,
  page: NotionPage,
): Promise<Response> {
  const payload = buildDiscordEmbed(page);

  const discordResponse = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!discordResponse.ok) {
    const errorText = await discordResponse.text();
    console.error("Discord webhook error:", errorText);
    return new Response(
      JSON.stringify({ error: "Discord webhook failed", details: errorText }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function authorize(request: Request, authToken: string): boolean {
  const header = request.headers.get("Authorization");
  if (!header) return false;
  const token = header.startsWith("Bearer ") ? header.slice(7) : header;
  return token === authToken;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "");

    if (!authorize(request, env.AUTH_TOKEN)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (
      path === "/lembretes/notificacao/discord" &&
      request.method === "POST"
    ) {
      const body = (await request.json()) as NotionWebhookBody;
      return sendDiscordNotification(env.DISCORD_WEBHOOK_URL, body.data);
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  },
};
