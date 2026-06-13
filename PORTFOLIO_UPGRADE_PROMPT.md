# PROMPT — Upgrade "moderno" do portfólio (blpsoares.dev)

> Cole este bloco inteiro numa **nova sessão do Claude Code aberta diretamente no repositório `blpsoares/portifolio`**.
> Ele descreve a missão, o contexto de arquitetura, as restrições inegociáveis, a orquestração em agentes paralelos (worktrees) e a spec detalhada de cada feature com critérios de aceite.

---

## 0) PAPEL E PADRÃO DE QUALIDADE

Você é um(a) **engenheiro(a) sênior de frontend + edge** liderando um upgrade do portfólio pessoal do Bryan Soares (`blpsoares.dev`). O conceito do site é meta: **"o portfólio não fala sobre engenharia de IA — ele É uma."** Cada interação precisa parecer produto sênior de 2026.

Padrão de qualidade — **não aceite resultado mediano**:
- Nada de "boilerplate genérico". Cada feature deve respeitar a linguagem visual existente (glassmorphism, paleta `brand` teal, fundos neurais, micro-interações com física).
- Acessível por padrão: teclado, `aria-*`, foco visível, e **respeitar `prefers-reduced-motion`** (o site já usa `useReducedMotion` do framer-motion e uma media query no CSS — siga o padrão).
- Performance: não bloquear o first paint; code-split o que for pesado; nada de re-render desnecessário.
- Tipagem estrita: **proibido `any`** (regra do repo). Código e comentários **em inglês**.
- i18n: **toda string visível ao usuário entra em `src/i18n/en.ts` E `src/i18n/pt.ts`** (mesma forma/objeto).
- O build **não pode quebrar**: rode `bun run build` e deixe verde antes de reportar qualquer track como pronto.

---

## 1) CONTEXTO DE ARQUITETURA (leia estes arquivos ANTES de codar)

**Stack:** React 19 + Vite 6 + TypeScript + Tailwind 3 (`darkMode: 'class'`) + framer-motion 12 + lucide-react + three / @react-three/fiber. Deploy em **Cloudflare Pages** com **Pages Functions** em `functions/api/*` (não há `wrangler.toml`; bindings se configuram no painel do Pages). Runtime/build/test sempre com **Bun**.

**Arquivos-chave para ler primeiro:**
- `src/App.tsx` — composição das seções + roteamento por hash (`#/vibe-projects`).
- `src/components/Hero.tsx` — hero com globo 3D lazy, parallax de scroll/mouse, `holo-text`.
- `src/components/Navbar.tsx` — navbar com dropdowns, toggle tema/idioma, download CV.
- `src/components/ui/GlowCard.tsx` — card glass com spotlight (`--mx/--my`) + `gradient-border`.
- `src/components/ui/Reveal.tsx` e `src/components/ScrollReveal.tsx` — animações de entrada (framer e IntersectionObserver).
- `src/index.css` — utilitários `.glass`, `.gradient-border`, `.spotlight`, `.agent-highlight`, `.holo-text`, `.hero-aurora`, `.hide-scrollbar`, `.markdown-body` + bloco `prefers-reduced-motion`.
- `tailwind.config.js` — paleta `brand`, fontes `display`/`mono`, keyframes/animations customizados.
- **Agente híbrido (chat):**
  - `functions/api/chat.ts` — o "garçom": guarda a `OPENROUTER_API_KEY`, faz origin-check, fallback multi-modelo, rate-limit por IP (KV `RATE_LIMIT` opcional) e **faz passthrough do SSE** do OpenRouter pro browser.
  - `functions/api/_context.ts` — `buildSystemPrompt(locale)` + `CV_CONTEXT` derivado de `src/data/profile.ts`.
  - `functions/api/models.ts` — `GET /api/models` lista modelos free.
  - `src/agent/chatClient.ts` — `streamAiReply()` faz parse do SSE (`choices[0].delta.content`), `AiUnavailable`.
  - `src/agent/engine.ts` — agente **determinístico** local: `AgentAction` (`scroll` | `download_cv` | `open_url` | `none`), `ToolCall {name,arg,action}`, `matchIntent()`.
  - `src/agent/useAgentChat.ts` — orquestra: monta mensagens, `runAction()` executa as ações no DOM (scroll/download/abrir URL), faz fallback determinístico.
  - `src/components/AgentChat.tsx` — UI do transcript (mensagens, linhas de reasoning `m.reasoning`, chip de tool `m.tool`, badge de fonte `m.source`/`m.model`).
  - `src/components/AgentDock.tsx` — orb flutuante + painel redimensionável.

**Ids de seção (para navegação por tool/scroll):** `profile` (Hero), `about`, `stack`, `lowcode`, `mcp`, `projects`, `career`, `education`, `learning`, `ai-usage`, e a sub-página `#/vibe-projects`. Seções expõem `data-section` / `data-section-label` (usado por `useActiveSection`).

---

## 2) RESTRIÇÕES INEGOCIÁVEIS (checklist por PR)

- [ ] Código e comentários em inglês; **sem `any`**; tipagem explícita.
- [ ] Strings novas em `en.ts` **e** `pt.ts`.
- [ ] Usar tokens Tailwind existentes (`brand-*`, `font-display`, `font-mono`, classes `glass`/`gradient-border`) — não inventar cores fora da paleta.
- [ ] `prefers-reduced-motion` respeitado em toda animação nova.
- [ ] `bun run build` verde.
- [ ] Não reescrever arquivos/lógica que não fazem parte do escopo (customizações manuais são preservadas).
- [ ] Acessibilidade: navegação por teclado, `aria-label`/`role` onde aplicável, foco visível.

---

## 3) ORQUESTRAÇÃO — AGENTES PARALELOS + WORKTREES

Você é o **orquestrador**. Para paralelizar com segurança e evitar conflitos de arquivo, distribua o trabalho em **3 tracks**, cada uma rodando como um **sub-agente em seu próprio git worktree** ramificado de uma branch de integração.

**Setup:**
1. Branch de integração: `git switch -c feat/modern-upgrade` (a partir de `main`).
2. Lance **3 sub-agentes em paralelo** (um único disparo com múltiplas tool calls), cada um em um **worktree isolado** (`isolation: "worktree"`), com a spec da sua track (seções 5–7).
3. Cada sub-agente deve: implementar, rodar `bun install` (se preciso) e **`bun run build` verde no seu worktree**, commitar com mensagens claras, e reportar a lista de arquivos tocados.
4. **Integração:** faça o merge na ordem **A → B → C**. Conflitos serão majoritariamente **aditivos** em arquivos-hub (`src/App.tsx`, `src/index.css`, `src/i18n/en.ts`, `src/i18n/pt.ts`, `tailwind.config.js`) — resolva preservando ambos os lados. Rode `bun run build` após cada merge.
5. Commit final + `git push -u origin feat/modern-upgrade`. **Não abra PR** a menos que seja pedido.

**Mapa de propriedade de arquivos (para minimizar colisão):**
- **Track A (Interações):** arquivos **novos** em `src/components/cmdk/`, `src/hooks/` (magnetic/tilt, count-up, decrypt) + edições pontuais em `Hero.tsx` e nos componentes que exibem números. Toca `App.tsx`, `en/pt.ts` (aditivo).
- **Track B (Motion & transitions):** `src/index.css`, `tailwind.config.js`, `App.tsx` (View Transitions na navegação por hash), refactor leve de `Reveal`/`ScrollReveal`.
- **Track C (Chat IA):** `functions/api/chat.ts`, `functions/api/_context.ts`, `src/agent/*`, `src/components/AgentChat.tsx`, + novo **worker de cron** (`worker-cron/` ou `scheduled/`) para o auto-rotate de modelos. **Quase disjunto** de A e B → paraleliza limpo.

> Conflitos esperados: `App.tsx` (A monta o CommandPalette + B aplica View Transitions), `index.css`/`tailwind.config.js`/`i18n` (aditivos). Use marcadores de bloco claros nos inserts para facilitar o merge.

---

## 4) DEFINIÇÃO DE PRONTO (por feature)

Cada feature precisa de: (a) implementação seguindo os padrões acima, (b) strings i18n nos dois idiomas quando houver texto, (c) variação `reduced-motion`, (d) `bun run build` verde, (e) uma nota curta no commit explicando a abordagem.

---

## 5) TRACK A — INTERAÇÕES (frontend)

### A1. Command Palette (⌘K / Ctrl+K)
- **Meta:** paleta de comandos estilo Raycast/Linear para navegação e ações rápidas.
- **Arquivos:** novo `src/components/cmdk/CommandPalette.tsx` + hook `src/hooks/useCommandPalette.ts`; montar global em `App.tsx`; atalho na `Navbar` (um chip "⌘K" discreto).
- **Abordagem:** sem libs novas — construir com framer-motion (já presente) e teclado nativo. Abre com `⌘K`/`Ctrl+K` e fecha com `Esc`. Lista fuzzy-filtrável de:
  - **Navegação:** todas as seções (reaproveite os ids da seção 1) → faz `scrollIntoView`.
  - **Ações:** baixar CV (PT/EN) via `useCvDownload`, alternar tema, alternar idioma, abrir o chat (AgentDock), abrir LinkedIn/GitHub.
- **UX:** overlay glass com `backdrop-blur`, input com foco automático, setas ↑/↓ para navegar, Enter executa, realce do item ativo na cor `brand`. Mobile: acessível por um botão.
- **A11y:** `role="dialog"` + `aria-modal`, trap de foco, restaurar foco ao fechar, navegação por teclado completa.
- **Aceite:** ⌘K abre/fecha; digitar filtra; Enter navega/age; funciona em PT e EN; reduced-motion remove as animações de mola.

### A2. Magnetic buttons + tilt 3D
- **Meta:** CTAs "magnéticos" (atraem levemente o cursor) e cards com leve tilt 3D no hover.
- **Arquivos:** novo `src/hooks/useMagnetic.ts` e `src/hooks/useTilt.ts` (ou um util com framer `useMotionValue`/`useSpring`); aplicar nos CTAs do `Hero.tsx`/`Navbar.tsx` e em `GlowCard.tsx` (tilt).
- **Abordagem:** usar `useMotionValue` + `useSpring` (padrão já usado no `Hero.tsx`). Magnetic: translada o elemento alguns px em direção ao cursor dentro de um raio; volta ao centro no `mouseleave`. Tilt: `rotateX/rotateY` sutis (máx ~6–8°) com `perspective`.
- **A11y:** desabilitar 100% quando `prefers-reduced-motion`; nunca afetar foco/click targets.
- **Aceite:** efeito perceptível mas sóbrio; sem jank; desliga em reduced-motion; toque (mobile) não quebra.

### A3. Hero com texto generativo / decrypt
- **Meta:** o título/role do Hero (`t.hero.title2` / `holo-text`) "decifra" caractere a caractere (efeito scramble/matrix) no load.
- **Arquivos:** novo `src/components/ui/DecryptText.tsx` (ou hook `useDecryptedText`); usar no `Hero.tsx`.
- **Abordagem:** componente que recebe o texto final e anima de caracteres aleatórios → texto real, com duração curta (~800ms) e easing. Combina com a vibe neural.
- **A11y:** se `prefers-reduced-motion`, renderiza o texto final direto (sem scramble). O texto acessível final precisa existir no DOM para leitores de tela (use `aria-label` com o texto real).
- **Aceite:** anima uma vez no mount; legível; reduced-motion mostra texto estático; sem layout shift (reserve o espaço).

### A4. Métricas animadas (count-up)
- **Meta:** números de impacto sobem de 0 ao valor quando entram na viewport.
- **Arquivos:** novo `src/hooks/useCountUp.ts` (IntersectionObserver + rAF); aplicar nos componentes que exibem métricas (ex.: `McpSection.tsx`, `Career.tsx`, `Projects.tsx`, `WhoIAm.tsx` — procure números como "10.000+ docs", "96%", "5+ anos", "20.000+", "10s → 2s").
- **Abordagem:** hook que aceita `to`, `duration`, `suffix/prefix` e formata (separador de milhar conforme locale). Dispara uma vez ao ficar visível. Não animar se reduced-motion (mostra o valor final).
- **Aceite:** conta uma vez ao entrar na tela; formatação correta PT/EN; reduced-motion = valor final imediato; sem "pulo" de layout.

---

## 6) TRACK B — MOTION & TRANSITIONS

### B1. View Transitions API na navegação home ↔ #/vibe-projects
- **Meta:** transição suave (morph/cross-fade) ao trocar de "página" (hoje é `hashchange` seco com `scrollTo(0,0)` em `App.tsx`).
- **Arquivos:** `src/App.tsx` (handler de hash) + `src/index.css` (regras `::view-transition-*`).
- **Abordagem:** usar `document.startViewTransition(() => setState(...))` quando suportado (feature-detect; fallback = troca direta). Definir `view-transition-name` nos containers de página. Animação curta e elegante.
- **A11y/perf:** respeitar `prefers-reduced-motion` (sem animação, troca instantânea). Sem afetar SSR/first paint.
- **Aceite:** navegação anima onde suportado; degradação graciosa onde não; reduced-motion neutro.

### B2. Scroll-driven animations nativas (CSS)
- **Meta:** substituir/augmentar parte das revelações por **CSS scroll-driven animations** (`animation-timeline: view()`), reduzindo JS.
- **Arquivos:** `src/index.css` (keyframes + `@supports (animation-timeline: view())`), `tailwind.config.js` (se criar utilitários), e adoção opcional em `ScrollReveal.tsx`/`Reveal.tsx` (manter fallback JS para browsers sem suporte).
- **Abordagem:** criar uma classe utilitária (ex.: `.reveal-on-scroll`) que usa `animation-timeline: view()` + `animation-range`. Envolver em `@supports` e manter o IntersectionObserver atual como fallback (não remover o que funciona — augmentar).
- **A11y:** dentro do bloco `prefers-reduced-motion`, desligar as animações scroll-driven.
- **Aceite:** em browsers modernos a revelação roda via CSS (menos trabalho de JS); browsers antigos continuam com o comportamento atual; reduced-motion estático.

---

## 7) TRACK C — CHAT IA (OpenRouter)

> Esta track é quase disjunta de A/B. Implemente com cuidado — é o coração conceitual do site.

### C1. Tool use REAL no LLM (function calling) — **a feature mais importante**
- **Problema atual:** o LLM só responde em **texto**; quem dirige a página é o detector determinístico (`matchIntent`) chamado *depois* da resposta. Queremos que a **própria IA** decida e dispare as ações.
- **Meta:** expor as ações existentes como **tools de function-calling** do OpenRouter; o modelo emite `tool_calls`; o **browser executa** (scroll/download/abrir URL) reusando `runAction()`.
- **Arquivos:** `functions/api/chat.ts` (enviar `tools` no body + manter streaming), `src/agent/chatClient.ts` (parse de `delta.tool_calls` no SSE), `src/agent/useAgentChat.ts` (executar as tool calls via `runAction`), `src/components/AgentChat.tsx` (renderizar o chip de tool a partir das calls reais), `src/agent/engine.ts` (reusar os tipos `AgentAction`).
- **Design (single-turn, sem round-trip de resultado):** as tools são **side-effects de UI** (não retornam dado que o modelo precise). Então:
  1. Backend manda no request: `tools: [...]`, `tool_choice: 'auto'`, `stream: true`.
  2. **Schema das tools** (mapear 1:1 para `AgentAction`):
     - `navigate_to_section(section: enum[profile,about,stack,lowcode,mcp,projects,career,education,learning,ai-usage])` → `{type:'scroll', target}`
     - `download_cv(language?: enum[pt,en])` → `{type:'download_cv', locale}`
     - `open_link(target: enum[linkedin,github,email])` → `{type:'open_url', url}` (resolva a URL no client a partir do alvo)
  3. **Client** acumula `choices[0].delta.tool_calls[]` (vêm fragmentados: `index`, `function.name`, `function.arguments` em pedaços JSON). Ao fechar o stream (ou ao detectar a call completa), parseia os args e chama `runAction()`. Continua renderizando o `delta.content` textual normalmente.
  4. Renderizar o **chip de tool real** (`m.tool`) no `AgentChat` a partir da call do modelo (substituindo o caminho fake do detector).
- **Robustez:** se o modelo não suportar tools, cai no comportamento atual (detector determinístico) — mantenha esse fallback. Sanitize/whitelist os argumentos (só seções/links conhecidos) **no client** antes de executar.
- **Aceite:** perguntar "me mostra os projetos de IA" faz a IA emitir `navigate_to_section('projects')` e a página rola de fato; "baixa o CV em inglês" dispara `download_cv('en')`; sem alucinação de alvos fora do whitelist; fallback funciona em modelos sem tool support.

### C2. Reasoning streaming REAL
- **Meta:** trocar as linhas de "thinking" hard-coded por **reasoning real** do modelo.
- **Arquivos:** `functions/api/chat.ts` (habilitar reasoning no request), `src/agent/chatClient.ts` (parse de `delta.reasoning`), `src/agent/useAgentChat.ts`/`AgentChat.tsx` (alimentar `m.reasoning` com o stream real).
- **Abordagem:** no body do OpenRouter, habilitar `reasoning: { effort: 'low' }` (ou `include_reasoning: true`). No SSE, ler `choices[0].delta.reasoning` (string incremental) e fazer append em `m.reasoning`. Quando o modelo não emite reasoning, o array fica vazio — **não** mostrar as linhas fake. Exibir reasoning enquanto não há `text` ainda (a UI já tem esse padrão).
- **Aceite:** com modelo de reasoning, o painel mostra o pensamento real em streaming; com modelo comum, nada de fake; transição suave para a resposta final.

### C3. Citações / grounding clicável
- **Meta:** a IA referencia seções e o frontend vira link clicável que dá scroll.
- **Arquivos:** `functions/api/_context.ts` (instrução no system prompt), `src/components/AgentChat.tsx`/`src/components/Markdown.tsx` (render dos marcadores).
- **Abordagem:** instruir o modelo a citar seções com um token estável, ex.: `[[section:projects]]`. No render do Markdown, transformar esses tokens em chips clicáveis (ex.: "↳ Projetos") que chamam o mesmo scroll de `runAction`. Token desconhecido → renderizar texto puro (sem quebrar).
- **Aceite:** respostas que mencionam áreas do CV ganham chips clicáveis que navegam; tokens malformados não aparecem crus nem quebram o layout.

### C4. Rate-limit por sessão (além de IP)
- **Meta:** limitar por **sessão** (uso justo) além do limite por IP (teto anti-abuso).
- **Arquivos:** `src/agent/chatClient.ts` (gerar/persistir `sessionId` em localStorage e enviar header `X-Session-Id`), `functions/api/chat.ts` (contadores KV por sessão + por IP).
- **Abordagem:** client gera um UUID uma vez e manda em `X-Session-Id`. Backend mantém `rl:ip:<ip>` e `rl:sess:<id>` no KV `RATE_LIMIT` com `expirationTtl`. Limites **tunáveis via env** (defaults sugeridos): IP ~20/min; sessão ~8/min e ~40/hora. Ao estourar → resposta `{ fallback: true, reason: 'rate_limited' }` (a UI já trata `limited` com cooldown). Sem KV configurado → degrade gracioso (não limita).
- **Aceite:** rajada na mesma sessão é barrada com mensagem amigável e cooldown; usuários distintos atrás do mesmo IP não se atrapalham até o teto de IP; limites configuráveis por env.

### C5. Telemetria (Cloudflare Analytics Engine)
- **Meta:** instrumentar o chat sem PII para entender uso.
- **Arquivos:** `functions/api/chat.ts` (write fire-and-forget) + nota de config do binding no `README`/`.dev.vars.example`.
- **Abordagem:** usar **Analytics Engine** (`env.ANALYTICS.writeDataPoint({ blobs: [categoria, modelo, locale, motivoFallback], doubles: [latenciaMs], indexes: [categoria] })`). **Nunca** registrar texto da pergunta, IP ou qualquer PII — só categoria inferida (ex.: 'career','projects','ai','hire','other'), modelo que respondeu, locale e se houve fallback. O write é não-bloqueante (`ctx.waitUntil` se disponível) e silencioso em erro. Documentar como bindar o dataset no painel do Pages (`[[analytics_engine_datasets]] binding = "ANALYTICS"`).
- **Aceite:** cada request grava um datapoint sem PII; falha de telemetria nunca afeta a resposta; instruções de binding documentadas.

### C6. Auto-rotate dos modelos free (cron) — *(chat #5)*
- **Problema:** os ids de modelos `:free` do OpenRouter **rotacionam** com o tempo; hoje a lista (`OPENROUTER_MODELS`/`DEFAULT_MODELS` em `functions/api/chat.ts`) é mantida na mão. O endpoint `functions/api/models.ts` já sabe listar os free, mas é manual.
- **Meta:** um **cron** atualiza periodicamente a lista de modelos ativos sozinho.
- **Arquivos:** novo Worker agendado (ex.: `worker-cron/index.ts` com handler `scheduled` e `[triggers] crons = ["0 */6 * * *"]` no seu `wrangler.toml` próprio) + leitura no `functions/api/chat.ts`.
- **Abordagem (KV como fonte da verdade):**
  1. O Worker de cron roda a cada ~6h: faz `GET https://openrouter.ai/api/v1/models`, filtra os `:free` (mesma lógica de `models.ts` — extraia para um util compartilhado), ordena por `context_length`, pega os top 3 e **grava no KV** (ex.: namespace `MODELS`, chave `active`).
  2. `functions/api/chat.ts` passa a resolver a lista nesta ordem: **KV `MODELS:active` → env `OPENROUTER_MODELS` → `DEFAULT_MODELS`**. Assim o cron mantém tudo fresco sem deploy, e os fallbacks garantem robustez se o KV estiver vazio.
  3. Validar o payload do KV (array de strings não vazio) antes de usar; em erro, cair pro próximo fallback silenciosamente.
- **Obs. de plataforma:** Cron Triggers são recurso de **Workers** (Pages Functions não rodam cron). Por isso o cron vive num Worker separado e pequeno, compartilhando o KV `MODELS` com as Functions do Pages. Documente o deploy do Worker e o binding KV nos dois lados.
- **Aceite:** o cron grava a lista atualizada no KV; o chat consome KV→env→defaults; sem KV/cron, comportamento atual preservado; util de filtro `:free` reaproveitado (sem duplicar lógica).

---

## 9) VERIFICAÇÃO FINAL (orquestrador)
- [ ] `bun run build` verde após todos os merges.
- [ ] Smoke manual (rodar `bun run dev`): ⌘K abre/age; hero decifra; números contam; CTAs magnéticos; cards com tilt; transição de página suave; chat dispara tools reais, mostra reasoning real, cita seções clicáveis.
- [ ] Testar com `prefers-reduced-motion: reduce` (DevTools) — tudo estático/sóbrio.
- [ ] Testar PT e EN.
- [ ] Commits claros (`feat:`/`refactor:`) por feature; `git push -u origin feat/modern-upgrade`.
- [ ] **Não** abrir PR a menos que pedido. Ao final, listar arquivos alterados e os passos de config pendentes: bindings KV (`RATE_LIMIT`, `MODELS`) e Analytics Engine no painel do Cloudflare Pages, env vars novas, e o **deploy do Worker de cron** (C6) com seu `[triggers] crons`.

---

### Resumo do escopo
Implementar: **A1** Command Palette ⌘K, **A2** Magnetic+Tilt, **A3** Hero decrypt, **A4** Count-up · **B1** View Transitions, **B2** Scroll-driven CSS · **C1** Tool use real, **C2** Reasoning streaming, **C3** Citações clicáveis, **C4** Rate-limit por sessão, **C5** Telemetria, **C6** Auto-rotate de modelos (cron). *(Sem OG image — fora do escopo.)*
