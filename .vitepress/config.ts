import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'PixelRoot32 Doc',
  description: 'A lightweight, modular 2D game engine for ESP32 and PC',
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico'}],
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
    logo: '/public/logo.png',
    
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Tools', link: '/guide/tools/' },
      { text: 'Architecture', link: '/architecture/overview' },
      { text: 'API', link: '/api/' },
      { text: 'Examples', link: '/examples/demos' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Core Concepts', link: '/guide/core-concepts' },
            { text: 'Game Loop', link: '/guide/game-loop' },
          ]
        },
        {
          text: 'Systems',
          items: [
            { text: 'Scenes', link: '/guide/scenes' },
            { text: 'Entities & Actors', link: '/guide/entities-actors' },
            { text: 'Rendering', link: '/guide/rendering' },
            { text: 'Input', link: '/guide/input' },
            { text: 'Physics', link: '/guide/physics' },
            { text: 'Audio', link: '/guide/audio' },
            { text: 'UI System', link: '/guide/ui-system' },
          ]
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Memory Management', link: '/guide/memory' },
            { text: 'Resolution Scaling', link: '/guide/resolution-scaling' },
            { text: 'Tilemaps', link: '/guide/tilemaps' },
            { text: 'Multi-Palette', link: '/guide/multi-palette' },
            { text: 'Platform Configuration', link: '/guide/platform-config' },
          ]
        },
        {
          text: 'Migrations',
          items: [
            { text: 'Overview', link: '/guide/migrations/overview' },
            { text: 'v1.0.0', link: '/guide/migrations/v1.0.0' },
            { text: 'v1.1.0', link: '/guide/migrations/v1.1.0' },
            { text: 'v1.2.0', link: '/guide/migrations/v1.2.0' },
          ]
        },
        {
          text: 'Contributing & tooling',
          items: [
            { text: 'Testing', link: '/guide/testing' },
            { text: 'Extending the engine', link: '/guide/extending' },
            { text: 'Music player', link: '/guide/music-player' },
          ]
        },
        {
          text: 'Tools',
          items: [
            { text: 'Overview', link: '/guide/tools/' },
            {
              text: 'Sprite Compiler',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/guide/tools/sprite-compiler/overview' },
                { text: 'Installation', link: '/guide/tools/sprite-compiler/installation' },
                { text: 'Usage guide', link: '/guide/tools/sprite-compiler/usage-guide' },
                { text: 'Advanced features', link: '/guide/tools/sprite-compiler/advanced-features' },
              ]
            },
            {
              text: 'Tilemap Editor',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/guide/tools/tilemap-editor/overview' },
                { text: 'Installation', link: '/guide/tools/tilemap-editor/installation' },
                { text: 'Usage guide', link: '/guide/tools/tilemap-editor/usage-guide' },
              ]
            },
          ]
        }
      ],
      '/architecture/': [
        {
          text: 'Architecture',
          items: [
            { text: 'Overview', link: '/architecture/overview' },
            { text: 'Layer Hierarchy', link: '/architecture/layers' },
            { text: 'Modules', link: '/architecture/modules' },
            { text: 'Design Patterns', link: '/architecture/patterns' },
          ]
        },
        {
          text: 'Subsystems',
          items: [
            { text: 'Rendering Pipeline', link: '/architecture/rendering-pipeline' },
            { text: 'Physics System', link: '/architecture/physics-system' },
            { text: 'Audio Architecture', link: '/architecture/audio-architecture' },
            { text: 'Memory System', link: '/architecture/memory-system' },
          ]
        },
        {
          text: 'Deep dives',
          items: [
            { text: 'Touch input', link: '/architecture/ARCH_TOUCH_INPUT' },
            { text: 'Resolution scaling', link: '/architecture/ARCH_RESOLUTION_SCALING' },
            { text: 'Tile animation', link: '/architecture/ARCH_TILE_ANIMATION' },
          ]
        }
      ],
      '/api/': [
        {
          text: 'Overview',
          items: [{ text: 'API home', link: '/api/' }]
        },
        {
          text: 'Core',
          items: [
            { text: 'Engine', link: '/api/core/engine' },
            { text: 'Scene', link: '/api/core/scene' },
            { text: 'Entity', link: '/api/core/entity' },
            { text: 'Actor', link: '/api/core/actor' },
            { text: 'SceneManager', link: '/api/core/scene-manager' },
          ]
        },
        {
          text: 'Graphics',
          items: [
            { text: 'Renderer', link: '/api/graphics/renderer' },
            { text: 'DrawSurface', link: '/api/graphics/draw-surface' },
            { text: 'Sprite', link: '/api/graphics/sprite' },
            { text: 'TileMap', link: '/api/graphics/tilemap' },
            { text: 'Color', link: '/api/graphics/color' },
            { text: 'Font', link: '/api/graphics/font' },
          ]
        },
        {
          text: 'Physics',
          items: [
            { text: 'CollisionSystem', link: '/api/physics/collision-system' },
            { text: 'KinematicActor', link: '/api/physics/kinematic-actor' },
            { text: 'RigidActor', link: '/api/physics/rigid-actor' },
            { text: 'StaticActor', link: '/api/physics/static-actor' },
            { text: 'SensorActor', link: '/api/physics/sensor-actor' },
          ]
        },
        {
          text: 'Audio',
          items: [
            { text: 'AudioEngine', link: '/api/audio/audio-engine' },
            { text: 'MusicPlayer', link: '/api/audio/music-player' },
            { text: 'AudioScheduler', link: '/api/audio/audio-scheduler' },
          ]
        },
        {
          text: 'Input',
          items: [
            { text: 'InputManager', link: '/api/input/input-manager' },
            { text: 'Touch System', link: '/api/input/touch-system' },
          ]
        },
        {
          text: 'Math',
          items: [
            { text: 'Scalar', link: '/api/math/scalar' },
            { text: 'Vector2', link: '/api/math/vector2' },
            { text: 'Rect', link: '/api/math/rect' },
          ]
        },
        {
          text: 'Platform',
          items: [
            { text: 'EngineConfig', link: '/api/platform/engine-config' },
            { text: 'PlatformCapabilities', link: '/api/platform/platform-capabilities' },
            { text: 'PlatformMemory', link: '/api/platform/platform-memory' },
          ]
        },
        {
          text: 'Module docs',
          items: [
            { text: 'Configuration flags', link: '/api/modules/configuration' },
            { text: 'UI module', link: '/api/modules/ui' },
          ]
        }
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
            { text: 'Physics', link: '/examples/physics-demo' },
            { text: 'Metroidvania', link: '/examples/metroidvania' },
            { text: 'Animated Tilemap', link: '/examples/animated-tilemap' },
            { text: 'Tilemaps (overview)', link: '/examples/tilemap-scene' },
            { text: 'Tic Tac Toe', link: '/examples/ui-layout' },
            { text: 'Flappy Bird', link: '/examples/flappy-bird' },
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
  }
})
