# Contributing to PixelRoot32-Docs

## Do not edit synced documentation by hand

These paths are **produced from the [PixelRoot32-Game-Engine](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine) repository** and must match `npm run sync-docs`:

| Site path | Engine source |
|-----------|----------------|
| `tools/**` | `docs/tools/` |
| `examples/*.md` | `examples/*/README.md`, `examples/README.md`, and `docs/guide/entities-scene-tutorial.md` → `basic-usage.md` |
| `guide/**` | `docs/guide/` (includes standards: coding style, guidelines, platform compatibility, performance) |
| `api/**` | `docs/api/` |
| `architecture/**` | `docs/architecture/` |
| `philosophy/**` | `docs/philosophy/` |
| `migration/**` | `docs/migration/` |

**Edit the engine**, then refresh the site copy:

```bash
# From this repo (PixelRoot32-Docs), with the engine cloned alongside or anywhere:
set PIXELROOT32_ENGINE_ROOT=C:\path\to\PixelRoot32-Game-Engine
npm run sync-docs
```

Or:

```bash
node scripts/sync-docs-from-engine.mjs --engine /path/to/PixelRoot32-Game-Engine
```

Commit the updated synced trees so CI `git diff` after sync stays clean.

**CI:** the workflow checks out the engine (`ref` from repo variable `ENGINE_DOCS_REF`, default `main`), runs the same sync, and **fails the build** if any of `tools/`, `examples/`, `guide/`, `api/`, `architecture/`, `philosophy/`, or `migration/` differ from the generated output.

## Site-only files (not synced)

- `.vitepress/**` — theme, nav, sidebars, build config
- `index.md` / `home.md` if present outside rewrites
- Root `README.md` (excluded from the public site)

When adding new engine doc pages, update `.vitepress/config.ts` sidebars if they should appear in navigation.
