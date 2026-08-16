import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { DefaultTheme } from 'vitepress'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Preferred display order for the subfolders under `api/generated/`.
 *
 * This list is an ordering hint, not an allowlist: any other directory the
 * engine generates is appended after these. When it was an allowlist, a module
 * added upstream (`apu`, `gameplay`) synced to disk but never reached the
 * sidebar, leaving its pages reachable only from the generated index.
 */
const CATEGORY_ORDER: readonly string[] = [
  'audio',
  'apu',
  'core',
  'gameplay',
  'math',
  'physics',
  'graphics',
  'input',
  'drivers',
  'platforms',
  'test',
]

const CATEGORY_LABEL: Record<string, string> = {
  audio: 'Audio',
  apu: 'APU',
  core: 'Core',
  gameplay: 'Gameplay',
  math: 'Math',
  physics: 'Physics',
  graphics: 'Graphics',
  input: 'Input',
  drivers: 'Drivers',
  platforms: 'Platforms',
  test: 'Test',
}

/** Directories present under `api/generated/`, known ones first, then the rest. */
function readCategories(root: string): string[] {
  if (!fs.existsSync(root)) return []

  const onDisk = fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)

  const known = CATEGORY_ORDER.filter((cat) => onDisk.includes(cat))
  const unlisted = onDisk
    .filter((cat) => !CATEGORY_ORDER.includes(cat))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))

  return [...known, ...unlisted]
}

/** Title-case fallback for a category with no explicit label. */
function categoryLabel(cat: string): string {
  return CATEGORY_LABEL[cat] ?? cat.charAt(0).toUpperCase() + cat.slice(1)
}

/**
 * Sidebar items for **Reference (Auto)**: index + one collapsible group per
 * generated category (scanned from disk so new types appear after sync).
 */
export function buildApiGeneratedSidebarItems(): DefaultTheme.SidebarItem[] {
  const root = path.join(__dirname, '..', 'api', 'generated')
  const items: DefaultTheme.SidebarItem[] = [
    { text: 'Index', link: '/api/generated/' },
  ]

  for (const cat of readCategories(root)) {
    const dir = path.join(root, cat)

    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.md') && f !== 'index.md')
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))

    const subItems: DefaultTheme.SidebarItem[] = files.map((f) => {
      const name = path.basename(f, '.md')
      return { text: name, link: `/api/generated/${cat}/${name}` }
    })

    items.push({
      text: categoryLabel(cat),
      collapsed: true,
      items: subItems,
    })
  }

  return items
}
