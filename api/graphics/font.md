# Font system

> **Source:** Ported from the [PixelRoot32 Game Engine](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine) repository. Cross-links were adjusted for this site.

## Font System

The engine includes a native bitmap font system that uses 1bpp sprites to render text.

### Font Structure

**Type:** `struct Font`

- **`const Sprite* glyphs`**: Array of sprite structures, one per character.
- **`uint8_t firstChar`**: First character code in the font (e.g., 32 for space).
- **`uint8_t lastChar`**: Last character code in the font (e.g., 126 for tilde).
- **`uint8_t glyphWidth`**: Fixed width of each glyph in pixels.
- **`uint8_t glyphHeight`**: Fixed height of each glyph in pixels.
- **`uint8_t spacing`**: Horizontal spacing between characters in pixels.
- **`uint8_t lineHeight`**: Vertical line height.

### FontManager

**Type:** `class FontManager`

Static utility class for managing fonts and calculating text dimensions.

- **`static void setDefaultFont(const Font* font)`**
    Sets the default font used by `Renderer::drawText()`.

- **`static const Font* getDefaultFont()`**
    Returns the currently active default font.

- **`static int16_t textWidth(const Font* font, std::string_view text, uint8_t size = 1)`**
    Calculates the pixel width of a text string.

- **`static bool isCharSupported(char c, const Font* font = nullptr)`**
    Checks if a character is supported by the font.

### Built-in Font: FONT_5X7

A built-in 5x7 pixel bitmap font containing ASCII characters from space (32) to tilde (126).

---
