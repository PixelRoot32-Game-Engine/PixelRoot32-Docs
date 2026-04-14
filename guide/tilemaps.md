# Tilemaps

Tilemaps are efficient for backgrounds and level geometry: the engine stores compact tile indices, applies palettes, and can skip off-screen regions.

## Features

- Generic `TileMap` templates for different BPP modes (see [TileMap API](/api/graphics/tilemap)).
- Viewport culling so only visible tiles hit the draw surface.
- Optional **tile animations** (water, lava, etc.) with O(1) frame lookup when enabled — see [Tile animation architecture](/architecture/ARCH_TILE_ANIMATION).
- Optional static layer cache on ESP32 for heavy 4bpp multi-layer scenes (described in the graphics API).

## Compile-time flags

`PIXELROOT32_ENABLE_TILE_ANIMATIONS`, `PIXELROOT32_ENABLE_STATIC_TILEMAP_FB_CACHE`, and related switches are documented in [Configuration flags](/api/modules/configuration) and the [API overview](/api/).

## Samples in the engine repo

- `examples/animated_tilemap` — animated tiles
- `examples/metroidvania` — larger scrollable maps
- `examples/snake` — minimal grid usage

## Related

- [Rendering](/guide/rendering)
- [Physics tile collision](/api/physics/collision-system)
