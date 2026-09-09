import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { DefaultTheme } from 'vitepress'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Preferred display order for the demo categories under `examples/`.
 *
 * This list is an ordering hint, not an allowlist: any other category the
 * demos repository grows is appended after these, so a new one still reaches
 * the sidebar instead of being reachable only from the catalogue page.
 *
 * Keep it aligned with `CATEGORY_ORDER` in `scripts/sync-docs-from-engine.mjs`.
 */
const CATEGORY_ORDER: readonly string[] = [
  'getting_started',
  'graphics',
  'input',
  'audio',
  'gameplay',
  'ui',
  'performance',
  'games',
]

const CATEGORY_LABEL: Record<string, string> = {
  getting_started: 'Getting Started',
  graphics: 'Graphics',
  input: 'Input',
  audio: 'Audio',
  gameplay: 'Gameplay',
  ui: 'UI',
  performance: 'Performance',
  games: 'Games',
}

/** Acronyms that must not be title-cased into `Ui` / `Sfx` / `Hud`. */
const ACRONYMS: Record<string, string> = { ui: 'UI', sfx: 'SFX', hud: 'HUD', api: 'API', npc: 'NPC' }

/** `sfx_bank` -> `SFX Bank`. */
function humanize(name: string): string {
  return name
    .split('_')
    .map((word) => ACRONYMS[word] ?? word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function categoryLabel(category: string): string {
  return CATEGORY_LABEL[category] ?? humanize(category)
}

/** Directories present under `examples/`, known ones first, then the rest. */
function readCategories(root: string): string[] {
  if (!fs.existsSync(root)) return []

  const onDisk = fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)

  const known = CATEGORY_ORDER.filter((category) => onDisk.includes(category))
  const unlisted = onDisk
    .filter((category) => !CATEGORY_ORDER.includes(category))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))

  return [...known, ...unlisted]
}

/**
 * Sidebar items for **Examples**: the catalogue page plus one collapsible
 * group per demo category (scanned from disk so demos synced from
 * PixelRoot32-Demo-Projects appear without editing the config by hand).
 */
export function buildExamplesSidebarItems(): DefaultTheme.SidebarItem[] {
  const root = path.join(__dirname, '..', 'examples')
  const items: DefaultTheme.SidebarItem[] = [
    { text: 'Catalogue', link: '/examples/demos' },
  ]

  for (const category of readCategories(root)) {
    const dir = path.join(root, category)

    // Each demo is a directory holding `index.md` plus its screenshots.
    const demos = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .filter((demo) => fs.existsSync(path.join(dir, demo, 'index.md')))
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))

    if (demos.length === 0) continue

    // Trailing slash: each demo page is an `index.md`, and under `cleanUrls`
    // its route is the directory itself (same shape as `/api/generated/`).
    const subItems: DefaultTheme.SidebarItem[] = demos.map((demo) => ({
      text: humanize(demo),
      link: `/examples/${category}/${demo}/`,
    }))

    items.push({
      text: categoryLabel(category),
      collapsed: true,
      items: subItems,
    })
  }

  return items
}
