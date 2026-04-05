# Renderer & Camera2D

> **Source:** Ported from the [PixelRoot32 Game Engine](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine) repository. Cross-links were adjusted for this site.

## Renderer

**Inherits:** None

High-level graphics rendering system. Provides a unified API for drawing shapes, text, and images, abstracting the underlying hardware implementation.

### Public Methods

- **`void beginFrame()`**
    Prepares the buffer for a new frame (clears screen). On drivers that support it (e.g. **TFT_eSPI_Drawer**), refreshes the internal pointer used for **direct logical framebuffer writes** (`DrawSurface::getSpriteBuffer()`) before clearing, so **2bpp / 4bpp** tile and sprite paths can avoid per-pixel virtual `drawPixel` calls.

- **`void endFrame()`**
    Finalizes the frame and sends the buffer to the display.

- **`void setOffsetBypass(bool bypass)`**
    Enables or disables camera offset bypass. When enabled, subsequent draw calls will ignore global x/y offsets (scrolling). This is typically managed automatically by `UILayout` when `fixedPosition` is enabled.

- **`bool isOffsetBypassEnabled() const`**
    Returns whether the offset bypass is currently active.

- **`void drawText(std::string_view text, int16_t x, int16_t y, Color color, uint8_t size)`**
    Draws a string of text using the native bitmap font system. Uses the default font set in `FontManager`, or a custom font if provided via the overloaded version.
  - **text**: The string to render (ASCII characters 32-126 are supported).
  - **x, y**: Position where text starts (top-left corner).
  - **color**: Color from the `Color` enum (uses sprite palette context).
  - **size**: Scale multiplier (1 = normal, 2 = double, 3 = triple, etc.).

- **`void drawText(std::string_view text, int16_t x, int16_t y, Color color, uint8_t size, const Font* font)`**
    Draws text using a specific font. If `font` is `nullptr`, uses the default font from `FontManager`.

- **`void drawTextCentered(std::string_view text, int16_t y, Color color, uint8_t size)`**
    Draws text centered horizontally at a given Y coordinate using the default font.

- **`void drawTextCentered(std::string_view text, int16_t y, Color color, uint8_t size, const Font* font)`**
    Draws text centered horizontally using a specific font. If `font` is `nullptr`, uses the default font from `FontManager`.

- **`void drawFilledCircle(int x, int y, int radius, uint16_t color)`**
    Draws a filled circle.

- **`void drawCircle(int x, int y, int radius, uint16_t color)`**
    Draws a circle outline.

- **`void drawRectangle(int x, int y, int width, int height, uint16_t color)`**
    Draws a rectangle outline.

- **`void drawFilledRectangle(int x, int y, int width, int height, uint16_t color)`**
    Draws a filled rectangle.

- **`void drawLine(int x1, int y1, int x2, int y2, uint16_t color)`**
    Draws a line between two points.

- **`void drawBitmap(int x, int y, int width, int height, const uint8_t *bitmap, uint16_t color)`**
    Draws a bitmap image.

- **`void drawPixel(int x, int y, uint16_t color)`**
    Draws a single pixel.

- **`void setOffset(int x, int y)`**
    Sets the hardware alignment offset for the display.

- **`void setRotation(uint8_t rotation)`**
    Sets the hardware rotation of the display.

- **`void drawSprite(const Sprite& sprite, int x, int y, Color color, bool flipX = false)`**
    Draws a 1bpp monochrome sprite described by a `Sprite` struct using a palette `Color`. Bit 0 of each row is the leftmost pixel, bit (`width - 1`) is the rightmost pixel.

- **`void drawSprite(const Sprite2bpp& sprite, int x, int y, uint8_t paletteSlot = 0, bool flipX = false)`**
    Available when `PIXELROOT32_ENABLE_2BPP_SPRITES` is defined. Draws a packed 2bpp sprite using the specified sprite palette slot. Index `0` is treated as transparent.

- **`void drawSprite(const Sprite4bpp& sprite, int x, int y, uint8_t paletteSlot = 0, bool flipX = false)`**
    Available when `PIXELROOT32_ENABLE_4BPP_SPRITES` is defined. Draws a packed 4bpp sprite using the specified sprite palette slot. Index `0` is treated as transparent.

- **`void drawSprite(const Sprite2bpp& sprite, int x, int y, bool flipX = false)`**
    Legacy overload for backward compatibility. Equivalent to `drawSprite(sprite, x, y, 0, flipX)`.

- **`void drawSprite(const Sprite4bpp& sprite, int x, int y, bool flipX = false)`**
    Legacy overload for backward compatibility. Equivalent to `drawSprite(sprite, x, y, 0, flipX)`.

- **`void setSpritePaletteSlotContext(uint8_t slot)`**
    Sets the sprite palette slot context for multi-palette sprites. When active, all subsequent `drawSprite` calls for 2bpp/4bpp sprites will use this slot regardless of the `paletteSlot` parameter.

- **`uint8_t getSpritePaletteSlotContext() const`**
    Gets the current sprite palette slot context.

- **`void drawMultiSprite(const MultiSprite& sprite, int x, int y)`**
    Draws a layered sprite composed of multiple 1bpp `SpriteLayer` entries.

- **`void drawTileMap(const TileMap& map, int originX, int originY, Color color)`**
    Draws a tile-based background using a compact `TileMap` descriptor built on 1bpp `Sprite` tiles. Includes automatic Viewport Culling.

- **`void drawTileMap(const TileMap2bpp& map, int originX, int originY)`**
    Available when `PIXELROOT32_ENABLE_2BPP_SPRITES` is defined. Draws a 2bpp tilemap.

- **`void drawTileMap(const TileMap4bpp& map, int originX, int originY)`**
    Available when `PIXELROOT32_ENABLE_4BPP_SPRITES` is defined. Draws a 4bpp tilemap.

- **`void setDisplaySize(int w, int h)`**
    Sets the logical display size.

- **`void setDisplayOffset(int x, int y)`**
    Sets a global offset for all drawing operations.

- **`void setContrast(uint8_t level)`**
    Sets the display contrast/brightness (0-255).

---


## Platform Optimizations (ESP32)

The engine includes several low-level optimizations for the ESP32 platform to maximize performance:

- **DMA Support**: Buffer transfers to the display are handled via DMA (`pushImageDMA`), allowing the CPU to process the next frame while the current one is being sent to the hardware.
- **IRAM Execution**: Critical rendering functions (`drawPixel`, `drawSpriteInternal`, `resolveColor`, `drawTileMap`) are decorated with `IRAM_ATTR` to run from internal RAM, bypassing the slow SPI Flash latency.
- **Palette Caching**: Tilemaps cache the resolved RGB565 LUT per tile.
- **Viewport Culling**: All tilemap rendering functions automatically skip tiles that are outside the current screen boundaries.
- **Direct logical framebuffer**: **`DrawSurface::getSpriteBuffer()`** exposes the **TFT_eSPI** 8bpp sprite memory when available; **`Renderer::beginFrame()`** caches that pointer so **2bpp / 4bpp** rasterization can write packed pixels directly (same packing as **`TFT_eSprite::drawPixel`** for 8bpp). **`DrawSurface::drawTileDirect()`** allows blitting pre-packed 8bpp tile rows where the driver implements it.

### Multi-layer 4bpp tilemap framebuffer snapshot: `StaticTilemapLayerCache`

**Header:** `graphics/StaticTilemapLayerCache.h` (engine API).

Use this when a **direct logical 8bpp sprite buffer** exists (`DrawSurface::getSpriteBuffer()` after `beginFrame`) to avoid redrawing “static” **4bpp** tilemaps every frame: the engine draws the static group, copies the framebuffer into an internal buffer, then each frame restores with **`memcpy`** and redraws only the **dynamic** group until the sampled camera changes or you **invalidate**.

| Type / method | Role |
|---------------|------|
| **`TileMap4bppDrawSpec`** | `{ const TileMap4bpp* map; int originX; int originY; }` — `map == nullptr` entries are skipped. |
| **`allocateForLogicalSize(w,h)`** / **`allocateForRenderer(renderer)`** | Pre-allocate **W×H** bytes during **`Scene::init()`** (not in `draw`/`update`). Returns `false` if allocation fails → full-draw fallback. |
| **`invalidate()`** | Mark cache stale (tile/palette/mask changes, or **`step()`** on animators bound to **static** layers). |
| **`draw(renderer, cameraSampleX, cameraSampleY, staticSpecs, staticCount, dynamicSpecs, dynamicCount)`** | Camera samples are typically **`-renderer.getXOffset()`** / **`-renderer.getYOffset()`** so scroll triggers rebuild. |
| **`setFramebufferCacheEnabled(false)`** | Runtime opt-out per scene (e.g. profiling); compile-time: **`PIXELROOT32_ENABLE_STATIC_TILEMAP_FB_CACHE=0`**. |

**Memory:** about **W×H** bytes (malloc-backed in `allocate*`; no heap use inside `draw`). If **`getSpriteBuffer()`** is **`nullptr`**, the implementation draws all groups every frame (same as SDL2 / non-sprite drivers).

**Example:** **`examples/animated_tilemap`** — `AnimatedTilemapScene` holds a **`StaticTilemapLayerCache`**, calls **`allocateForRenderer(engine.getRenderer())`** in **`init()`**, builds **`TileMap4bppDrawSpec`** arrays for **background + ground** (static) and **details** (dynamic), and exposes **`invalidateStaticLayerCache()`** as a thin wrapper over **`invalidate()`**.

For the full pipeline diagram and layering context, see [Architecture — ESP32 rendering pipeline and tilemap caching](/architecture/overview#esp32-rendering-pipeline-and-tilemap-caching).

---


## Camera2D

**Inherits:** None

The `Camera2D` class provides a 2D camera system for managing the viewport and scrolling of the game world. It handles coordinate transformations and target following with configurable dead zones.

### Public Methods

- **`Camera2D(int viewportWidth, int viewportHeight)`**
    Constructs a new `Camera2D` with the specified viewport dimensions.

- **`void setBounds(float minX, float maxX)`**
    Sets the horizontal boundaries for the camera.

- **`void setVerticalBounds(float minY, float maxY)`**
    Sets the vertical boundaries for the camera.

- **`void setPosition(float x, float y)`**
    Sets the camera's position directly.

- **`void followTarget(float targetX)`**
    Updates the camera position to follow a target's x coordinate.

- **`void followTarget(float targetX, float targetY)`**
    Updates the camera position to follow a target's x and y coordinates.

- **`float getX() const`**
    Returns the current x position of the camera.

- **`float getY() const`**
    Returns the current y position of the camera.

- **`void apply(Renderer& renderer) const`**
    Applies the camera's transformation to the renderer.

- **`void setViewportSize(int width, int height)`**
    Updates the viewport size.

---
