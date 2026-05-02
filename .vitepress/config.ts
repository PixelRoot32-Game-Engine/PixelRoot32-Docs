import { defineConfig } from 'vitepress'
import { buildApiGeneratedSidebarItems } from './buildApiGeneratedSidebar'

/** Deploy base: `/` locally; CI sets VITEPRESS_BASE (e.g. `/RepoName/` for GitHub project pages). */
function siteBase(): string {
  const raw = process.env.VITEPRESS_BASE?.trim()
  if (!raw || raw === '/') return '/'
  return raw.endsWith('/') ? raw : `${raw}/`
}

/** Absolute URL path under base (favicon, theme logo). */
function assetUrl(path: string): string {
  const p = path.startsWith('/') ? path.slice(1) : path
  const b = siteBase()
  if (b === '/') return `/${p}`
  return `${b}${p}`
}

const base = siteBase()

export default defineConfig({
  base,

  /** Extension-less links; GitHub Pages resolves `/path` → `/path.html` (see VitePress routing docs). */
  cleanUrls: true,

  /** Map root / to show guide/getting-started content without redirect */
  rewrites: {
    'guide/getting-started.md': 'index.md',
  },

  /** Sitemap generation for SEO */
  sitemap: {
    hostname: 'https://docs.pixelroot32.org',
    lastmodDateOnly: false,
  },

  /** Enable last updated timestamps for sitemap <lastmod> */
  lastUpdated: true,

  title: 'PixelRoot32 Doc',
  description: 'A lightweight, modular 2D game engine written in C++17 and designed specifically for ESP32 microcontrollers.',

  /** Example READMEs link to repo-relative source paths (./src/...) that are not VitePress routes. */
  ignoreDeadLinks: [/^https?:\/\//, /^\.\//, /^\.\.\//],

  /** Repo README: contributor setup only, not public doc pages */
  srcExclude: ['README.md', '_legacy_vitepress/**'],

  head: [
    ['link', { rel: 'icon', href: assetUrl('favicon.ico') }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,600;1,400&display=swap',
      },
    ],
    ['meta', { name: 'theme-color', content: '#cd2f50' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    ['meta', { name: 'og:site_name', content: 'PixelRoot32' }],
  ],

  themeConfig: {
    logo: assetUrl('logo.png'),
    
    nav: [
      { text: 'Guide', link: '/' },
      { text: 'Architecture', link: '/architecture/overview' },
      { text: 'API', link: '/api/' },
      { text: 'Migration', link: '/migration/' },
      { text: 'Philosophy', link: '/philosophy/' },
      { text: 'Tools', link: '/tools/' },
      { text: 'Examples', link: '/examples/demos' },
    ],

    sidebar: {
      '/': [
        { text: 'Guide home', link: '/guide/' },
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/' },
            { text: 'Core Concepts', link: '/guide/core-concepts' },
            { text: 'Game Loop', link: '/guide/game-loop' },
          ],
        },
        {
          text: 'Game systems',
          items: [
            { text: 'Scenes', link: '/guide/scenes' },
            { text: 'Entities & Actors', link: '/guide/entities-actors' },
            { text: 'Rendering', link: '/guide/rendering' },
            { text: 'Input', link: '/guide/input' },
            { text: 'Physics', link: '/guide/physics' },
            { text: 'Audio', link: '/guide/audio' },
            { text: 'UI System', link: '/guide/ui-system' },
          ],
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Memory', link: '/guide/memory' },
            { text: 'Resolution scaling', link: '/guide/performance/resolution-scaling' },
            { text: 'Tilemaps', link: '/guide/tilemaps' },
            { text: 'Multi-Palette', link: '/guide/multi-palette' },
            { text: 'Platform Configuration', link: '/guide/platform-config' },
          ],
        },
        {
          text: 'Contributing & quality',
          items: [
            { text: 'Testing', link: '/guide/testing' },
            { text: 'Extending (drivers & hooks)', link: '/guide/extending-pixelroot32' },
            { text: 'Gameplay guidelines', link: '/guide/gameplay-guidelines' },
            { text: 'Entities tutorial', link: '/guide/entities-scene-tutorial' },
            { text: 'Music player', link: '/guide/music-player-guide' },
          ],
        },
        {
          text: 'Standards & compatibility',
          items: [
            { text: 'Coding style', link: '/guide/coding-style' },
            { text: 'Style guide', link: '/guide/style-guide' },
            { text: 'Graphics guidelines', link: '/guide/graphics-guidelines' },
            { text: 'UI guidelines', link: '/guide/ui-guidelines' },
            { text: 'Platform compatibility', link: '/guide/platform-compatibility' },
            { text: 'Performance hub', link: '/guide/performance/' },
          ],
        },
      ],
      '/guide/': [
        { text: 'Guide home', link: '/guide/' },
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/' },
            { text: 'Core Concepts', link: '/guide/core-concepts' },
            { text: 'Game Loop', link: '/guide/game-loop' },
          ],
        },
        {
          text: 'Game systems',
          items: [
            { text: 'Scenes', link: '/guide/scenes' },
            { text: 'Entities & Actors', link: '/guide/entities-actors' },
            { text: 'Rendering', link: '/guide/rendering' },
            { text: 'Input', link: '/guide/input' },
            { text: 'Physics', link: '/guide/physics' },
            { text: 'Audio', link: '/guide/audio' },
            { text: 'UI System', link: '/guide/ui-system' },
          ],
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Memory', link: '/guide/memory' },
            { text: 'Resolution scaling', link: '/guide/performance/resolution-scaling' },
            { text: 'Tilemaps', link: '/guide/tilemaps' },
            { text: 'Multi-Palette', link: '/guide/multi-palette' },
            { text: 'Platform Configuration', link: '/guide/platform-config' },
          ],
        },
        {
          text: 'Contributing & quality',
          items: [
            { text: 'Testing', link: '/guide/testing' },
            { text: 'Extending (drivers & hooks)', link: '/guide/extending-pixelroot32' },
            { text: 'Gameplay guidelines', link: '/guide/gameplay-guidelines' },
            { text: 'Entities tutorial', link: '/guide/entities-scene-tutorial' },
            { text: 'Music player', link: '/guide/music-player-guide' },
          ],
        },
        {
          text: 'Standards & compatibility',
          items: [
            { text: 'Coding style', link: '/guide/coding-style' },
            { text: 'Style guide', link: '/guide/style-guide' },
            { text: 'Graphics guidelines', link: '/guide/graphics-guidelines' },
            { text: 'UI guidelines', link: '/guide/ui-guidelines' },
            { text: 'Platform compatibility', link: '/guide/platform-compatibility' },
            { text: 'Performance hub', link: '/guide/performance/' },
          ],
        },
      ],
      '/tools/': [
        {
          text: 'Tools',
          items: [
            { text: 'Overview', link: '/tools/' },
            {
              text: 'Sprite Compiler',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/tools/sprite-compiler/overview' },
                { text: 'Installation', link: '/tools/sprite-compiler/installation' },
                { text: 'Usage guide', link: '/tools/sprite-compiler/usage-guide' },
                { text: 'Advanced features', link: '/tools/sprite-compiler/advanced-features' },
              ]
            },
            {
              text: 'Tilemap Editor',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/tools/tilemap-editor/overview' },
                { text: 'Quick start', link: '/tools/tilemap-editor/quick-start' },
                { text: 'Installation', link: '/tools/tilemap-editor/installation' },
                { text: 'Usage guide', link: '/tools/tilemap-editor/usage-guide' },
                { text: 'Advanced guide', link: '/tools/tilemap-editor/advanced-guide' },
                { text: 'Technical reference', link: '/tools/tilemap-editor/technical-reference' },
              ]
            },
          ]
        }
      ],
      '/architecture/': [
        {
          text: 'Architecture',
          items: [
            { text: 'Index', link: '/architecture/' },
            { text: 'Overview', link: '/architecture/overview' },
            { text: 'Layer overview', link: '/architecture/layers-overview' },
          ],
        },
        {
          text: 'Layers',
          items: [
            { text: 'Layer 0 — Hardware', link: '/architecture/layer-hardware' },
            { text: 'Layer 1 — Drivers', link: '/architecture/layer-drivers' },
            { text: 'Layer 2 — Abstraction', link: '/architecture/layer-abstraction' },
            { text: 'Layer 3 — Systems', link: '/architecture/layer-systems' },
            { text: 'Layer 4 — Scene', link: '/architecture/layer-scene' },
          ],
        },
        {
          text: 'Subsystems',
          items: [
            { text: 'Audio subsystem', link: '/architecture/audio-subsystem' },
            { text: 'Physics subsystem', link: '/architecture/physics-subsystem' },
            { text: 'Memory system', link: '/architecture/memory-system' },
            { text: 'Resolution scaling', link: '/architecture/resolution-scaling' },
            { text: 'Tile animation', link: '/architecture/tile-animation' },
            { text: 'Touch input', link: '/architecture/touch-input' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'Overview',
          items: [{ text: 'Overview', link: '/api/' }],
        },
        {
          text: 'Modules',
          items: [
            { text: 'Configuration', link: '/api/config' },
            { text: 'Math', link: '/api/math' },
            { text: 'Core', link: '/api/core' },
            { text: 'Physics', link: '/api/physics' },
            { text: 'Graphics', link: '/api/graphics' },
            { text: 'UI', link: '/api/ui' },
            { text: 'Audio', link: '/api/audio' },
            { text: 'Input', link: '/api/input' },
            { text: 'Platform', link: '/api/platform' },
          ],
        },
        {
          text: 'Reference (Auto)',
          items: buildApiGeneratedSidebarItems(),
        },
      ],
      '/philosophy/': [
        {
          text: 'Philosophy',
          items: [
            { text: 'Index', link: '/philosophy/' },
            { text: 'Engine philosophy', link: '/philosophy/engine-philosophy' },
          ],
        },
      ],
      '/migration/': [
        {
          text: 'Migration',
          items: [
            { text: 'Overview', link: '/migration/' },
            { text: 'v1.0.0', link: '/migration/migration-v1-0-0' },
            { text: 'v1.1.0', link: '/migration/migration-v1-1-0' },
            { text: 'v1.2.0', link: '/migration/migration-v1-2-0' },
          ],
        },
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Samples index (repo catalogue)', link: '/examples/demos' },
            { text: 'Hello World', link: '/examples/hello-world' },
            { text: 'Camera', link: '/examples/camera' },
            { text: 'Dual Palette', link: '/examples/dual-palette' },
            { text: 'Sprites', link: '/examples/sprite-animation' },
            { text: 'Snake', link: '/examples/snake' },
            { text: 'Brick Breaker', link: '/examples/brick-breaker' },
            { text: 'Space Invaders', link: '/examples/space-invaders' },
            { text: 'Physics', link: '/examples/physics-demo' },
            { text: 'Metroidvania', link: '/examples/metroidvania' },
            { text: 'Animated Tilemap', link: '/examples/animated-tilemap' },
            { text: 'Tilemaps (overview)', link: '/examples/tilemap-scene' },
            { text: 'Tic Tac Toe', link: '/examples/tic-tac-toe' },
            { text: 'UI layout (Tic Tac Toe)', link: '/examples/ui-layout' },
            { text: 'Flappy Bird', link: '/examples/flappy-bird' },
            { text: 'Music demo (audio)', link: '/examples/music-demo' },
            { text: 'Audio (Snake + Tic Tac Toe)', link: '/examples/audio-playback' },
            { text: 'Entities tutorial (not in repo)', link: '/examples/basic-usage' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 PixelRoot32'
    },

    search: {
      provider: 'local'
    },

    outline: {
      level: [2, 3]
    }
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true,
    config(md) {
      const fence = md.renderer.rules.fence!
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        const info = token.info.trim()
        if (info === 'mermaid') {
          const raw = token.content.trimEnd()
          // Source only in data-definition: raw `<` / `-->` in body breaks HTML and mermaid parsing.
          const def = encodeURIComponent(raw)
          return `<div class="mermaid" data-definition="${def}"></div>\n`
        }
        return fence(tokens, idx, options, env, self)
      }
    }
  },

  vite: {
    plugins: [
      {
        name: 'vitepress-deny-root-readme',
        enforce: 'pre',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const pathOnly = req.url?.split('?')[0] ?? ''
            // srcExclude skips the page in build/search, but dev can still resolve README.md — block public URL
            if (/^\/README(\.html)?\/?$/i.test(pathOnly)) {
              res.statusCode = 404
              res.setHeader('Content-Type', 'text/plain; charset=utf-8')
              res.end('Not Found')
              return
            }
            next()
          })
        },
      },
    ],
  },
})
