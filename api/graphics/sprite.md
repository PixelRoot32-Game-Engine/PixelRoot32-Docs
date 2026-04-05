# Sprites & SpriteAnimation

> **Source:** Ported from the [PixelRoot32 Game Engine](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine) repository. Cross-links were adjusted for this site.

## Sprite Structures

### Sprite

Compact descriptor for monochrome bitmapped sprites used by `Renderer::drawSprite`.

- **`const uint16_t* data`**  
  Pointer to an array of 16-bit rows. Each `uint16_t` packs pixels for one row.

- **`uint8_t width`**  
  Sprite width in pixels (typically ≤ 16).

- **`uint8_t height`**  
  Sprite height in pixels.

### Sprite2bpp

Optional descriptor for packed 2bpp sprites, enabled when `PIXELROOT32_ENABLE_2BPP_SPRITES` is defined.

- **`const uint8_t* data`**: Packed 2bpp bitmap data.
- **`const Color* palette`**: Sprite-local palette.
- **`uint8_t width, height`**: Dimensions.
- **`uint8_t paletteSize`**: Number of palette entries.

### Sprite4bpp

Optional descriptor for packed 4bpp sprites, enabled when `PIXELROOT32_ENABLE_4BPP_SPRITES` is defined.

- **`const uint8_t* data`**: Packed 4bpp bitmap data.
- **`const Color* palette`**: Sprite-local palette.
- **`uint8_t width, height`**: Dimensions.
- **`uint8_t paletteSize`**: Number of palette entries.

### SpriteLayer

Single monochrome layer used by layered sprites (`MultiSprite`).

### MultiSprite

Multi-layer, multi-color sprite built from one or more `SpriteLayer` entries.

---


## SpriteAnimation

Lightweight, step-based animation controller for sprite frames.

### Properties

- **`const SpriteAnimationFrame* frames`**: Pointer to frame table.
- **`uint8_t frameCount`**: Number of frames.
- **`uint8_t current`**: Current frame index.

### Public Methods

- **`void reset()`**: Resets animation to first frame.
- **`void step()`**: Advances by one frame, wraps at end.
- **`const SpriteAnimationFrame& getCurrentFrame() const`**: Returns current frame.
- **`const Sprite* getCurrentSprite() const`**: Convenience accessor.

---
