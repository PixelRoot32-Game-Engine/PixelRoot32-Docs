import DefaultTheme from 'vitepress/theme'
import './custom.css'
import type { EnhanceAppContext } from 'vitepress'
import { inBrowser } from 'vitepress'
import { nextTick } from 'vue'
import mermaid from 'mermaid'

function resetMermaidInDoc() {
  document.querySelectorAll('.vp-doc .mermaid').forEach((el) => {
    const def = el.getAttribute('data-definition')
    if (!def) return
    el.removeAttribute('data-processed')
    el.textContent = decodeURIComponent(def)
  })
}

/** Inject diagram text from data-definition before mermaid.run (SSR-safe). */
function hydrateMermaidFromDataAttrs() {
  document.querySelectorAll('.vp-doc .mermaid[data-definition]').forEach((el) => {
    if (el.hasAttribute('data-processed')) return
    const def = el.getAttribute('data-definition')
    if (!def) return
    el.textContent = decodeURIComponent(def)
  })
}

async function runMermaidDiagrams() {
  await nextTick()
  await new Promise<void>((r) => requestAnimationFrame(() => r()))

  hydrateMermaidFromDataAttrs()

  const isDark = document.documentElement.classList.contains('dark')
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme: isDark ? 'dark' : 'default',
  })

  await mermaid.run({
    querySelector: '.vp-doc .mermaid',
    suppressErrors: true,
  })
}

function scheduleMermaid(reset: boolean) {
  if (reset) resetMermaidInDoc()
  void runMermaidDiagrams()
}

export default {
  extends: DefaultTheme,
  enhanceApp(ctx: EnhanceAppContext) {
    if (!inBrowser) return

    const { router } = ctx

    const prevAfterRoute = router.onAfterRouteChange
    router.onAfterRouteChange = (to) => {
      void prevAfterRoute?.(to)
      scheduleMermaid(false)
    }

    const prevAfterPage = router.onAfterPageLoad
    router.onAfterPageLoad = (to) => {
      void prevAfterPage?.(to)
      scheduleMermaid(false)
    }

    let lastDark = document.documentElement.classList.contains('dark')
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark')
      if (isDark === lastDark) return
      lastDark = isDark
      scheduleMermaid(true)
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    scheduleMermaid(false)
  },
}
