import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { DefaultTheme } from 'vitepress'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Subfolders under `api/generated/` (excluding `index.md` at root). */
const CATEGORY_ORDER = [
  'audio',
  'core',
  'math',
  'physics',
  'graphics',
  'input',
  'drivers',
  'platforms',
  'test',
] as const

const CATEGORY_LABEL: Record<string, string> = {
  audio: 'Audio',
  core: 'Core',
  math: 'Math',
  physics: 'Physics',
  graphics: 'Graphics',
  input: 'Input',
  drivers: 'Drivers',
  platforms: 'Platforms',
  test: 'Test',
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

  for (const cat of CATEGORY_ORDER) {
    const dir = path.join(root, cat)
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) continue

    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.md') && f !== 'index.md')
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))

    const subItems: DefaultTheme.SidebarItem[] = files.map((f) => {
      const name = path.basename(f, '.md')
      return { text: name, link: `/api/generated/${cat}/${name}` }
    })

    items.push({
      text: CATEGORY_LABEL[cat] ?? cat,
      collapsed: true,
      items: subItems,
    })
  }

  return items
}
