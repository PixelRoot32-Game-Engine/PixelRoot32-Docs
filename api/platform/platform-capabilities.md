# Platform capabilities & logging

> **Source:** Ported from the [PixelRoot32 Game Engine](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine) repository. Cross-links were adjusted for this site.

## Platform Abstractions Overview

Version 1.1.0 introduces unified abstractions for cross-platform operations, eliminating the need for manual `#ifdef` blocks in user code.

---


## Logging System

**Namespace:** `pixelroot32::core::logging`

The unified logging system provides platform-agnostic logging with different log levels, automatically routing to the appropriate output (Serial for ESP32, stdout for native). Enable with `-DPIXELROOT32_DEBUG_MODE` in build flags.

### Log Levels

| LogLevel Enum | Output Prefix | Use Case |
|--------------|---------------|----------|
| `LogLevel::Info` | `[INFO]` | General information, debug messages |
| `LogLevel::Profiling` | `[PROF]` | Performance timing markers |
| `LogLevel::Warning` | `[WARN]` | Warnings, non-critical issues |
| `LogLevel::Error` | `[ERROR]` | Errors, critical failures |

### Functions

- **`void log(LogLevel level, const char* format, ...)`**
    Logs a message with the specified level and printf-style formatting.

- **`void log(const char* format, ...)`**
    Logs a message with Info level (shorthand).

### Conditional Compilation

When `PIXELROOT32_DEBUG_MODE` is **not defined**, all `log()` calls become no-ops at compile time. The engine uses a double-layer conditional:

1. **`#ifdef PIXELROOT32_DEBUG_MODE`** in the header makes `log()` calls emit formatting code
2. **`if constexpr (EnableLogging)`** in the implementation skips runtime formatting

This means zero runtime cost in production builds (no string formatting, no branching).

### Usage Example

```cpp
// Enable in platformio.ini:
// build_flags = -D PIXELROOT32_DEBUG_MODE

#include "core/Log.h"

using namespace pixelroot32::core::logging;

// Log with explicit level
log(LogLevel::Info, "Player position: %d", playerX);

// Log warning
log(LogLevel::Warning, "Low memory: %d bytes free", freeRAM);

// Log error
log(LogLevel::Error, "Failed to load sprite: %s", filename);

// Log with default Info level
log("Player position: %d", playerX);
```

---


## PlatformCapabilities

**Namespace:** `pixelroot32::platforms`

A structure that holds detected hardware capabilities, used to optimize task pinning and threading.

### Properties

- **`bool hasDualCore`**: True if the hardware has more than one CPU core.
- **`int coreCount`**: Total number of CPU cores detected.
- **`int audioCoreId`**: Recommended CPU core for audio tasks.
- **`int mainCoreId`**: Recommended CPU core for the main game loop.
- **`int audioPriority`**: Recommended priority for audio tasks.

### Static Methods

- **`static PlatformCapabilities detect()`**: Automatically detects hardware capabilities based on the platform and configuration. It respects the defaults defined in `platforms/PlatformDefaults.h` and any compile-time overrides.

---
