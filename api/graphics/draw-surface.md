# DrawSurface

> **Source:** Ported from the [PixelRoot32 Game Engine](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine) repository. Cross-links were adjusted for this site.

## DrawSurface

Abstract interface for platform-specific drawing operations.

### Public Methods

- **`virtual void init()`**: Initializes the hardware or window.
- **`virtual void setRotation(uint8_t rotation)`**: Sets display rotation.
- **`virtual void clearBuffer()`**: Clears the frame buffer.
- **`virtual void sendBuffer()`**: Sends the frame buffer to the display.
- **`virtual void drawPixel(int x, int y, uint16_t color)`**: Draws a single pixel.
- **`virtual uint8_t* getSpriteBuffer()`**: Returns a pointer to the **logical** framebuffer for direct CPU writes when supported (**TFT_eSPI_Drawer** 8bpp sprite); default returns **`nullptr`** (e.g. **SDL2_Drawer**).
- **`virtual void drawTileDirect(uint16_t x, uint16_t y, uint16_t w, uint16_t h, const uint8_t* data)`**: Optional 8bpp tile blit into that buffer; default no-op.
- **`virtual void drawLine(...)`**, **`drawRectangle(...)`**, **`drawCircle(...)`**, etc.

---


## BaseDrawSurface

**Inherits:** [DrawSurface](#drawsurface)

Optional base class that provides default primitive rendering.

- At minimum, implement: `init()`, `drawPixel()`, `sendBuffer()`, `clearBuffer()`
- Default implementations use `drawPixel()` - slow but functional.

---
