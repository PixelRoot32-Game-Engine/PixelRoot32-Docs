# Platform memory

> **Source:** Ported from the [PixelRoot32 Game Engine](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine) repository. Cross-links were adjusted for this site.

## Platform Memory Abstraction

**Include:** `platforms/PlatformMemory.h`

Provides a unified API for memory operations that differ between ESP32 (Flash/PROGMEM) and Native (RAM) platforms.

### Macros

- **`PIXELROOT32_FLASH_ATTR`**
    Attribute for data stored in Flash memory.

- **`PIXELROOT32_STRCMP_P(dest, src)`**
    Compare a RAM string with a Flash string.

- **`PIXELROOT32_MEMCPY_P(dest, src, size)`**
    Copy data from Flash to RAM.

- **`PIXELROOT32_READ_BYTE_P(addr)`**
    Read an 8-bit value from Flash.

- **`PIXELROOT32_READ_WORD_P(addr)`**
    Read a 16-bit value from Flash.

- **`PIXELROOT32_READ_DWORD_P(addr)`**
    Read a 32-bit value from Flash.

- **`PIXELROOT32_READ_FLOAT_P(addr)`**
    Read a float value from Flash.

- **`PIXELROOT32_READ_PTR_P(addr)`**
    Read a pointer from Flash.

### Usage Example

```cpp
#include "platforms/PlatformMemory.h"

const char MY_STRING[] PIXELROOT32_FLASH_ATTR = "Hello";
char buffer[10];
PIXELROOT32_STRCMP_P(buffer, MY_STRING);
uint8_t val = PIXELROOT32_READ_BYTE_P(&my_array[i]);
```

---
