# TileMap & tile animation

> **Source:** Ported from the [PixelRoot32 Game Engine](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine) repository. Cross-links were adjusted for this site.

## TileMap

### TileMapGeneric (Template)

Generic descriptor for tile-based backgrounds.

#### Template Parameters

- **`T`**: The sprite type used for tiles (e.g., `Sprite`, `Sprite2bpp`, `Sprite4bpp`).

#### Properties

- **`uint8_t* indices`**: Array of tile indices.
- **`uint8_t width, height`**: Dimensions in tiles.
- **`const T* tiles`**: Pointer to the tileset array.
- **`uint8_t tileWidth, tileHeight`**: Tile dimensions in pixels.
- **`uint16_t tileCount`**: Number of unique tiles.
- **`uint8_t* runtimeMask`**: Optional bitmask for runtime tile activation.
- **`const uint8_t* paletteIndices`**: Optional per-cell background palette index.
- **`TileAnimationManager* animManager`**: Optional pointer for tile animations.

### Type Aliases

- **`TileMap`** = `TileMapGeneric<Sprite>` (1bpp)
- **`TileMap2bpp`** = `TileMapGeneric<Sprite2bpp>` (2bpp, conditional)
- **`TileMap4bpp`** = `TileMapGeneric<Sprite4bpp>` (4bpp, conditional)

---


## Tile Animation System

The Tile Animation System enables frame-based tile animations (water, lava, fire, etc.) while maintaining static tilemap data and ESP32-optimized performance.

### TileAnimation

**Namespace:** `pixelroot32::graphics`

- **`uint8_t baseTileIndex`**: First tile in the animation sequence.
- **`uint8_t frameCount`**: Number of frames in the animation.
- **`uint8_t frameDuration`**: How many **60 Hz logical ticks** each animation cell is held (1–255). Pacing uses **wall time** between `step` calls (see engine `TileAnimationManager`); speed does not follow main-loop iteration count when **`draw`/`present`** are skipped.

### TileAnimationManager

Manages tile animations for a tilemap.

#### Public Methods

- **`void step(unsigned long deltaTimeMs)`**  
  Advances animations from elapsed time. Pass **`Scene::update`**’s **`deltaTime`**. High-resolution pacing between calls keeps speed correct when **`millis()`** delta is often **0** on tight loops.

- **`void reset()`**  
  Resets all animations to frame 0.

- **`uint8_t resolveFrame(uint8_t tileIndex)`**  
  Resolves tile index to current animated frame. O(1) lookup.

---


## Tilemap rendering notes

`Renderer::drawTileMap` always applies **viewport culling** and per-tile rasterization. Optional **`drawTileDirect()`** on `DrawSurface` (when implemented by the driver) can blit pre-packed 8bpp tile rows into the logical sprite buffer. For static **4bpp** layer reuse, use **`StaticTilemapLayerCache`** and **`PIXELROOT32_ENABLE_STATIC_TILEMAP_FB_CACHE`** (see main Graphics / configuration docs).

---


## Tile Attribute System

The tile attribute system provides runtime access to custom metadata attached to tiles in tilemaps.

### TileAttribute

- **`const char* key`**: Attribute key (PROGMEM string).
- **`const char* value`**: Attribute value (PROGMEM string).

### TileAttributeEntry

- **`uint16_t x, y`**: Tile coordinates in layer space.
- **`uint8_t num_attributes`**: Number of attributes.
- **`const TileAttribute* attributes`**: PROGMEM array of key-value pairs.

### LayerAttributes

- **`const char* layer_name`**: Layer name (PROGMEM string).
- **`uint16_t num_tiles_with_attributes`**: Number of tiles with attributes.
- **`const TileAttributeEntry* tiles`**: PROGMEM array of tiles with attributes.

### Query Functions

**Namespace:** `pixelroot32::graphics`

- **`const char* get_tile_attribute(const LayerAttributes* layers, uint8_t num_layers, uint8_t layer_idx, uint16_t x, uint16_t y, const char* key)`**
    Returns the value of a specific attribute for a tile.

- **`bool tile_has_attributes(const LayerAttributes* layers, uint8_t num_layers, uint8_t layer_idx, uint16_t x, uint16_t y)`**
    Returns `true` if the tile has any attributes.

> [!IMPORTANT]
> Since attributes are stored in Flash memory on ESP32, you must use **`PIXELROOT32_STRCMP_P`** or **`PIXELROOT32_MEMCPY_P`** to compare or copy the returned values.

---
