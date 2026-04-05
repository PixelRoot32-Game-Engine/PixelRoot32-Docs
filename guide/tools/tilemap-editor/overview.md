# Tilemap Editor Overview

The **PixelRoot32 Tilemap Editor** is a visual tool for multi-layer tile maps: tilesets, scenes, export to **C++** aligned with the PixelRoot32 renderer, and ESP32-oriented constraints (layer limits, PROGMEM-friendly data).

::: tip Premium module

The Tilemap Editor is part of the **Tool Suite**. Licensing and downloads: [pixelroot32.com](https://pixelroot32.com).

:::

## What it does

- **Paint** tiles on a canvas with layers and transparency.
- **Manage tilesets** from PNG imports; single or multi-tile selection.
- **Multiple scenes** in one project with shared tilesets.
- **Onion skinning** — overlay adjacent scenes for alignment.
- **Layers** — per-scene stacks (up to **4 layers** on ESP32-class targets), **palette slots P0–P7** for multi-palette export.
- **Tile animations** with preview.
- **Tile attributes** — collision / gameplay metadata and export rules.
- **Export** — headers/sources for the engine; single- or multi-palette pipelines depending on layer slot assignment.
- **BPP** — 1bpp / 2bpp / 4bpp export paths to trade RAM vs color depth.

## Key features (summary)

| Area | Highlights |
|------|------------|
| Tools | Brush, eraser, fill, pipette, attribute tool, animation eyedropper, live animation preview |
| Scenes | Multiple maps, onion skin, per-scene size, rename / duplicate / delete |
| Layers | Visibility, reorder, palette slot per layer |
| Tilesets | Multi-tileset projects, zoom, auto tile size detection |
| Export | Scene `.h` / `.cpp`, optional animation companions, `setBackgroundCustomPaletteSlot()` wiring |

## Data formats

### Project (`.pr32scene` / `.pr32scene.bin`)

- **JSON (`.pr32scene`)** — human-readable, git-friendly.
- **Binary (`.pr32scene.bin`)** — much smaller on disk, faster load/save.

### Exported C++

- Scene pair: `scene_name.h` / `scene_name.cpp`.
- Optional: `scene_name_animations.h` / `.cpp`.
- Tile indices per layer, tileset references, palette data; multi-palette uses per-layer slot setup.

## Getting started

1. **New project** — tile size, map dimensions, target resolution.
2. **Import tilesets** — drag into the tileset panel or use the menu.
3. **Add layers** — background, collision, detail, etc.
4. **Paint** on the canvas.
5. **Export to C++** and link the generated files into your engine project.

Full UI walkthrough: [Usage guide](/guide/tools/tilemap-editor/usage-guide).

## Next steps

- [Installation](/guide/tools/tilemap-editor/installation)
- [Usage guide](/guide/tools/tilemap-editor/usage-guide)

## See also

- [Tools overview](/guide/tools/)
- [Tilemaps](/guide/tilemaps)
- [ARCH tile animation](/architecture/ARCH_TILE_ANIMATION)
