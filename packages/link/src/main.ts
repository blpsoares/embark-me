import '@fontsource/bitter/700.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/jetbrains-mono/400.css'
import './style.css'
import { PROFILE, PROFILE_LINKS, PROJECTS, type Project, type ProfileLink } from './projects'

/** Usada só se o CSS não responder, o que não deve acontecer. */
const STAGE_WIDTH_FALLBACK = 1440

/**
 * Largura da tela virtual, lida do CSS.
 *
 * O valor muda entre desktop e celular, e quem decide é a media query em
 * `style.css`. Ler de lá evita ter o mesmo corte de tamanho escrito em dois
 * lugares que podem discordar.
 */
function stageWidth(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--stage-width')
  const parsed = Number.parseFloat(raw)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : STAGE_WIDTH_FALLBACK
}

const GITHUB_MARK =
  'M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.5 0-.24-.01-.9-.01-1.76-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5.01 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.81 0 .28.18.6.69.5A10.03 10.03 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z'

const EXTERNAL_ICON = 'M7 17 17 7M9 7h8v8'

const LINKEDIN_MARK =
  'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z'

/** Uma casa com um caminho, para o site pessoal. */
const SITE_ICON = 'M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9.5ZM9.5 21v-6h5v6'

function svg(paths: { d: string; fill?: boolean }[]): string {
  const body = paths
    .map((path) =>
      path.fill
        ? `<path d="${path.d}" fill="currentColor" />`
        : `<path d="${path.d}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />`,
    )
    .join('')
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`
}

const githubIcon = () => svg([{ d: GITHUB_MARK, fill: true }])
const externalIcon = () => svg([{ d: EXTERNAL_ICON }])

const PROFILE_ICONS: Record<ProfileLink['icon'], () => string> = {
  site: () => svg([{ d: SITE_ICON }]),
  github: githubIcon,
  linkedin: () => svg([{ d: LINKEDIN_MARK, fill: true }]),
}

/** Escapa texto antes de entrar no HTML, mesmo vindo de um módulo nosso. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** `github.com/blpsoares/agentistics`, que é como a pessoa reconhece o repo. */
function repoLabel(repo: string): string {
  return repo.replace(/^https?:\/\//, '')
}

function hostLabel(site: string): string {
  return site.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

function renderPreview(project: Project): string {
  if (!project.site) {
    return `
      <div class="preview preview--mark">
        <span class="preview-tag">só repositório</span>
        ${githubIcon()}
      </div>`
  }

  return `
    <div class="preview" data-preview>
      <span class="preview-tag">${escapeHtml(hostLabel(project.site))}</span>
      <iframe
        src="${escapeHtml(project.site)}"
        title="Prévia de ${escapeHtml(project.title)}"
        loading="lazy"
        tabindex="-1"
        aria-hidden="true"
        referrerpolicy="no-referrer"
        scrolling="no"
      ></iframe>
    </div>`
}

function renderCard(project: Project): string {
  const siteLink = project.site
    ? `<a class="card-link card-link--primary" href="${escapeHtml(project.site)}" target="_blank" rel="noopener noreferrer">
         ${externalIcon()}<span>abrir site</span>
       </a>`
    : ''

  return `
    <article class="card">
      ${renderPreview(project)}
      <div class="card-body">
        <h3 class="card-title">${escapeHtml(project.title)}</h3>
        <p class="card-repo">${escapeHtml(repoLabel(project.repo))}</p>
        <p class="card-description">${escapeHtml(project.description)}</p>
        <div class="card-links">
          ${siteLink}
          <a class="card-link" href="${escapeHtml(project.repo)}" target="_blank" rel="noopener noreferrer">
            ${githubIcon()}<span>código</span>
          </a>
        </div>
      </div>
    </article>`
}

function render(root: HTMLElement): void {
  root.innerHTML = `
    <main class="page">
      <header>
        <p class="kicker">${escapeHtml(PROFILE.handle)}</p>
        <h1 class="name">${escapeHtml(PROFILE.name)}</h1>
        <p class="tagline">${escapeHtml(PROFILE.tagline)}</p>
        <nav class="profile-links" aria-label="Onde me encontrar">
          ${PROFILE_LINKS.map(
            (link) => `
            <a class="profile-link" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">
              ${PROFILE_ICONS[link.icon]()}<span>${escapeHtml(link.label)}</span>
            </a>`,
          ).join('')}
        </nav>
      </header>

      <h2 class="section-label">Projetos</h2>
      <div class="grid">
        ${PROJECTS.map(renderCard).join('')}
      </div>

      <footer class="footer">
        Construído com <a href="https://github.com/opvibes/embark" target="_blank" rel="noopener noreferrer">embark</a>
        e publicado na Cloudflare.
      </footer>
    </main>`
}

/**
 * Encolhe cada prévia até a largura real do cartão.
 *
 * O fator não dá para fixar no CSS: a grade é fluida e a largura do cartão muda
 * com a janela. Sem recalcular no resize, a prévia sobra ou falta depois de
 * qualquer mudança de tamanho.
 */
function fitPreviews(root: HTMLElement): void {
  const previews = root.querySelectorAll<HTMLElement>('[data-preview]')

  function fit(): void {
    const stage = stageWidth()
    previews.forEach((preview) => {
      const frame = preview.querySelector('iframe')
      if (!frame) return
      frame.style.transform = `scale(${preview.clientWidth / stage})`
    })
  }

  fit()
  if (previews.length > 0) {
    new ResizeObserver(fit).observe(previews[0] as Element)
  }
  window.addEventListener('resize', fit)
}

const root = document.getElementById('app')
if (root) {
  render(root)
  fitPreviews(root)
}
