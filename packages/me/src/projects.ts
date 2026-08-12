/**
 * Os projetos que aparecem na grade.
 *
 * As descrições não são inventadas: cada uma é uma redução do README ou da
 * descrição do próprio repositório no GitHub, anotada em `source` para dar para
 * conferir depois. Site público com texto errado sobre o próprio projeto é o
 * tipo de erro que alguém descobre e comenta.
 */

export type Project = {
  /** Nome do repositório, como aparece na URL do GitHub. */
  name: string
  /** Como o projeto se apresenta, quando difere do nome do repositório. */
  title: string
  description: string
  /** De onde a descrição foi tirada. Só documentação, não vai para a tela. */
  source: string
  repo: string
  /** Ausente quando o projeto não tem site publicado. */
  site?: string
}

export type ProfileLink = {
  label: string
  url: string
  icon: 'site' | 'github' | 'linkedin'
}

export const PROFILE = {
  name: 'Bryan Soares',
  handle: 'blpsoares',
  tagline: 'Desenvolvimento orientado a specs, e as ferramentas que saíram disso.',
} as const

/**
 * Os três lugares onde a pessoa me encontra.
 *
 * O LinkedIn nunca entra como prévia: eles bloqueiam enquadramento e respondem
 * 999 para qualquer requisição que não venha de um navegador. É link e ponto.
 */
export const PROFILE_LINKS: ProfileLink[] = [
  { label: 'blpsoares.dev', url: 'https://blpsoares.dev', icon: 'site' },
  { label: 'github.com/blpsoares', url: 'https://github.com/blpsoares', icon: 'github' },
  { label: 'in/blpsoares', url: 'https://www.linkedin.com/in/blpsoares', icon: 'linkedin' },
]

export const PROJECTS: Project[] = [
  {
    name: 'agentistics',
    title: 'agentistics',
    description:
      'Analytics local-first para assistentes de código com IA. Uma máquina ou um time inteiro: acompanhar, analisar e melhorar.',
    source: 'README: "Local-first analytics for AI coding assistants, one machine or a whole team" + "Track, Analyze, Improve"',
    repo: 'https://github.com/blpsoares/agentistics',
    site: 'https://agentistics.openvibes.tech',
  },
  {
    name: 'parity-driven-development',
    title: 'PDD',
    description:
      'Refactor, rewrite e port de legado com paridade comportamental rastreada. Cada comportamento do sistema de referência vira um finding para investigar, provar e passar por QA antes de chegar na main.',
    source: 'README: "A framework for reliable legacy refactor, rewrite, and port, with tracked behavioral parity" + parágrafo de abertura',
    repo: 'https://github.com/blpsoares/parity-driven-development',
    site: 'https://pdd.openvibes.tech',
  },
  {
    name: 'embark',
    title: 'embark',
    description:
      'Monorepo que automatiza tudo entre o código e a produção. Cria o pacote, commita, empurra: cada pacote tem seu próprio pipeline, e um push publica só o que mudou.',
    source: 'README: "A monorepo framework that automates everything between code and production" + Key Concepts',
    repo: 'https://github.com/opvibes/embark',
    site: 'https://embark.openvibes.tech',
  },
  {
    name: 'claude-code-notifications',
    title: 'claude-code-notifications',
    description:
      'Notificações nativas do Windows para o Claude Code rodando no WSL: toast com título da sessão, trecho da resposta, logo, clique para focar e botões de permissão.',
    source: 'Descrição do repositório no GitHub',
    repo: 'https://github.com/blpsoares/claude-code-notifications',
  },
]
