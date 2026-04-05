# Modules & compilation

> **Source:** Ported from the [PixelRoot32 Game Engine](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine) repository. Cross-links were adjusted for this site.

# API Reference: Configuration

This document covers global configuration options, build flags, and compile-time constants for the PixelRoot32 Game Engine.

> **Note:** This is part of the [API Reference](/api/). See the main index for complete documentation.

---

## Platform Macros (Build Flags)

| Macro | Description | Default (ESP32) |
|-------|-------------|-----------------|
| `PR32_DEFAULT_AUDIO_CORE` | CPU core assigned to audio tasks. | `0` |
| `PR32_DEFAULT_MAIN_CORE` | CPU core assigned to the main game loop. | `1` |
| `PIXELROOT32_NO_DAC_AUDIO` | Disable Internal DAC support on classic ESP32. | Enabled |
| `PIXELROOT32_NO_I2S_AUDIO` | Disable I2S audio support. | Enabled |
| `PIXELROOT32_USE_U8G2_DRIVER` | Enable U8G2 display driver support for monochromatic OLEDs. | Disabled |
| `PIXELROOT32_NO_TFT_ESPI` | Disable default TFT_eSPI driver support. | Enabled |

---

## Modular Compilation Flags

| Macro | Description | Default |
|-------|-------------|---------|
| `PIXELROOT32_ENABLE_AUDIO` | Enable audio subsystem (AudioEngine + MusicPlayer). | `1` |
| `PIXELROOT32_ENABLE_PHYSICS` | Enable physics system (CollisionSystem). | `1` |
| `PIXELROOT32_ENABLE_UI_SYSTEM` | Enable UI system (UIButton, UILabel, etc.). | `1` |
| `PIXELROOT32_ENABLE_PARTICLES` | Enable particle system. | `1` |
| `PIXELROOT32_ENABLE_DEBUG_OVERLAY` | Enable FPS/RAM/CPU debug overlay. | Disabled |
| `PIXELROOT32_ENABLE_TILE_ANIMATIONS` | Enable tile animation system. | `1` |
| `PIXELROOT32_ENABLE_2BPP_SPRITES` | Enable 2bpp sprite support. | Disabled |
| `PIXELROOT32_ENABLE_4BPP_SPRITES` | Enable 4bpp sprite support. | Disabled |
| `PIXELROOT32_ENABLE_SCENE_ARENA` | Enable scene memory arena. | Disabled |
| `PIXELROOT32_ENABLE_PROFILING` | Enable profiling hooks in physics pipeline. | Disabled |
| `PIXELROOT32_ENABLE_TOUCH` | Enable automatic touch processing in Engine (mouse-to-touch on Native, touch point injection on ESP32). | `0` (disabled) |
| `PIXELROOT32_ENABLE_TILEMAP_OPTIMIZATION` | Enable tilemap optimizations (TileCache, ChunkManager, DirtyTileTracker). | `1` |
| `PIXELROOT32_ENABLE_STATIC_TILEMAP_FB_CACHE` | Enable **`StaticTilemapLayerCache`** (4bpp direct logical framebuffer snapshot). Set `0` to save ~W×H RAM or force full redraw. | `1` (`PlatformDefaults.h`) |
| `PIXELROOT32_TILE_CACHE_SIZE` | LRU cache size for pre-rendered tiles. | `16` |
| `PIXELROOT32_DIRTY_TRACKER_SIZE` | Number of tiles to track for animation changes. | `256` |
| `PIXELROOT32_CHUNK_SIZE` | Chunk size for viewport culling (tiles per chunk). | `8` |
| `PIXELROOT32_DEBUG_MODE` | Enable unified logging system. | Disabled |

---

## Memory Savings by Subsystem

| Subsystem Disabled | RAM Savings | Flash Savings |
|-------------------|-------------|--------------|
| `PIXELROOT32_ENABLE_AUDIO=0` | ~8 KB | ~15 KB |
| `PIXELROOT32_ENABLE_PHYSICS=0` | ~12 KB | ~25 KB |
| `PIXELROOT32_ENABLE_UI_SYSTEM=0` | ~4 KB | ~20 KB |
| `PIXELROOT32_ENABLE_PARTICLES=0` | ~6 KB | ~10 KB |
| `PIXELROOT32_ENABLE_TOUCH=0` | ~200 bytes | ~2 KB |

---

## Build Profiles (platformio.ini)

```ini
[profile_full]         ; All features enabled
build_flags =
    -D PIXELROOT32_ENABLE_AUDIO=1
    -D PIXELROOT32_ENABLE_PHYSICS=1
    -D PIXELROOT32_ENABLE_PARTICLES=1
    -D PIXELROOT32_ENABLE_UI_SYSTEM=1

[profile_arcade]       ; Audio + Physics + Particles, no UI
build_flags =
    -D PIXELROOT32_ENABLE_AUDIO=1
    -D PIXELROOT32_ENABLE_PHYSICS=1
    -D PIXELROOT32_ENABLE_PARTICLES=1
    -D PIXELROOT32_ENABLE_UI_SYSTEM=0

[profile_puzzle]       ; Audio + UI only, no physics/particles
build_flags =
    -D PIXELROOT32_ENABLE_AUDIO=1
    -D PIXELROOT32_ENABLE_PHYSICS=0
    -D PIXELROOT32_ENABLE_PARTICLES=0
    -D PIXELROOT32_ENABLE_UI_SYSTEM=1

[profile_retro]        ; Minimal: no subsystems
build_flags =
    -D PIXELROOT32_ENABLE_AUDIO=0
    -D PIXELROOT32_ENABLE_PHYSICS=0
    -D PIXELROOT32_ENABLE_PARTICLES=0
    -D PIXELROOT32_ENABLE_UI_SYSTEM=0
```

---

## Recommended Profiles by Game Type

| Game Type | Recommended Profile | Rationale |
|-----------|-------------------|-----------|
| Arcade (shooters, platformers) | `arcade` or `full` | Physics + particles + optional UI |
| Puzzle / Casual | `puzzle` | UI for menus, simple collision logic |
| Retro / Minimal | `retro` | Minimal footprint, custom collision |
| Educational / Tool | `puzzle` or custom | UI for menus |

---

## Constants

- **`DISPLAY_WIDTH`**
    The width of the display in pixels. Default is `240`.

- **`DISPLAY_HEIGHT`**
    The height of the display in pixels. Default is `240`.

- **`int xOffset`**
    The horizontal offset for the display alignment. Default is `0`.

- **`int yOffset`**
    The vertical offset for the display alignment. Default is `0`.

- **`PHYSICS_MAX_PAIRS`**
    Maximum number of collision pairs considered in broadphase. Default is `128`.

- **`PHYSICS_MAX_CONTACTS`**
    Maximum number of simultaneous contacts in the solver (fixed pool, no heap per frame). Default is `128`. When exceeded, additional contacts are dropped.

- **`VELOCITY_ITERATIONS`**
    Number of impulse solver passes per frame. Higher values improve stacking stability but increase CPU load. Default is `2`.

- **`SPATIAL_GRID_CELL_SIZE`**
    Size of each cell in the broadphase grid (in pixels). Default is `32`.

- **`SPATIAL_GRID_MAX_ENTITIES_PER_CELL`**
    Legacy: maximum entities per cell when using a single grid. Default is `24`.

- **`SPATIAL_GRID_MAX_STATIC_PER_CELL`**
    Maximum static (immovable) actors per grid cell. Default is `12`. Used by the static layer of the spatial grid.

- **`SPATIAL_GRID_MAX_DYNAMIC_PER_CELL`**
    Maximum dynamic (RIGID/KINEMATIC) actors per grid cell. Default is `12`. Used by the dynamic layer of the spatial grid.

---

## Custom Scene Limits

The engine defines default limits in `platforms/EngineConfig.h`: `MAX_LAYERS` (default 3) and `MAX_ENTITIES` (default 32). These are guarded with `#ifndef`, so you can override them from your project without modifying the engine.

**Compiler flags (recommended)**

In your project (e.g. in `platformio.ini`), add the defines to `build_flags`:

```ini
build_flags =
    -DMAX_LAYERS=5
    -DMAX_ENTITIES=64
```

---

## Related Documentation

- [API Reference](/api/) - Main index
- [Platform Compatibility Guide](/guide/platform-config)
- [Extending PixelRoot32](/guide/extending)

---

# Architecture Overview - PixelRoot32 Game Engine

## Executive Summary

PixelRoot32 is a lightweight, modular 2D game engine written in C++17, designed primarily for ESP32 microcontrollers, with a native simulation layer for PC (SDL2) that enables rapid development without hardware.

The engine follows a scene-based architecture inspired by Godot Engine, making it intuitive for developers familiar with modern game development workflows.

> **Note:** For detailed architecture documentation with diagrams and examples, visit the [official documentation](https://docs.pixelroot32.org/manual/engine_architecture/).

---

## Design Philosophy

- **Modularity**: Each subsystem can be used independently and compiled conditionally
- **Selective Compilation**: Subsystems can be excluded at compile time to reduce firmware size and RAM usage
- **Portability**: Same code for ESP32 and PC (SDL2)
- **Performance**: Optimized for resource-constrained hardware with aggressive dead code elimination
- **Extensibility**: Plugin architecture for drivers and backends
- **Modern C++**: Leverages C++17 features (smart pointers, string_view) for safety and efficiency

### What Does "Modularity" Mean in PixelRoot32?

**Modularity** means that each main subsystem has **low coupling** and can be instantiated, tested, and used in isolation, without depending on other subsystems. This allows:

- **Independent testing**: Each module can be unit tested
- **Selective usage**: Use only the modules you need
- **Easy replacement**: Change implementations without affecting the rest of the code
- **Conditional compilation**: Exclude entire subsystems at compile time to save firmware size and RAM

**Concrete examples of independence:**

```cpp
// 1. AudioEngine works without Renderer or SceneManager (if enabled)
#if PIXELROOT32_ENABLE_AUDIO
AudioConfig audioConfig;
AudioEngine audio(audioConfig);
audio.init();
audio.playEvent({WaveType::PULSE, 440.0f, 0.5f, 0.8f});
#endif

// 2. Renderer can be used without Audio or Input
DisplayConfig displayConfig;
Renderer renderer(displayConfig);
renderer.init();
renderer.beginFrame();
renderer.drawSprite(sprite, 10, 10, Color::White);
renderer.endFrame();

// 3. InputManager is autonomous
InputConfig inputConfig;
InputManager input(inputConfig);
input.init();
input.update(deltaTime);
if (input.isButtonPressed(0)) { /* ... */ }

// 4. CollisionSystem is optional per scene (if enabled)
#if PIXELROOT32_ENABLE_PHYSICS
Scene scene;
// You can update physics only if you need it
scene.collisionSystem.update();
#endif

// 5. Interchangeable drivers without changing game code
// Same code works with TFT_eSPI_Drawer, U8G2_Drawer, or SDL2_Drawer
```

**Note**: `Engine` is the only component with tight coupling (orchestrates everything), but each subsystem can exist and function independently. The modular compilation system uses `PIXELROOT32_ENABLE_*` flags to conditionally compile subsystems, dramatically reducing firmware size and RAM usage on embedded targets.

---

## Main Architectural Features

- Stack-based Scene-Entity system
- Rendering with logical resolution independent of physical resolution
- NES-style 4-channel audio subsystem (conditionally compiled)
- UI system with automatic layouts (conditionally compiled)
- "Flat Solver" physics with specialized Actor types (conditionally compiled)
- Circular and AABB collision support
- Multi-platform support through driver abstraction
- **Modular compilation** for selective subsystem inclusion

---

## Layer Hierarchy

The engine is organized into 5 architectural layers:

| Layer | Name | Description | Document |
|-------|------|-------------|----------|
| Layer 0 | Hardware | Physical hardware (ESP32, displays, audio) | [Hardware Layer](/architecture/layers) |
| Layer 1 | Drivers | Platform-specific drivers (TFT_eSPI, U8G2, SDL2) | [Driver Layer](/architecture/layers) |
| Layer 2 | Abstraction | Abstract interfaces (DrawSurface, PlatformMemory) | [Abstraction Layer](/architecture/layers) |
| Layer 3 | Systems | High-level subsystems (Renderer, Audio, Physics, UI) | [System Layer](/architecture/layers) |
| Layer 4 | Scene | Scene and entity management | [Scene Layer](/architecture/layers) |
| Layer 5 | Game | User game code | (Implemented by user) |

Layer diagram: see [Architecture overview](/architecture/overview).

---

## Subsystem Deep Dives

For detailed documentation on specific subsystems, see:

| Subsystem | Document |
|-----------|----------|
| Audio NES | [Audio Subsystem](/architecture/audio-architecture) |
| Physics | [Physics Subsystem](/architecture/physics-system) |
| Memory Management | [Memory System](/architecture/memory-system) |
| Resolution Scaling | [Resolution Scaling](/architecture/ARCH_RESOLUTION_SCALING) |
| Tile Animation | [Tile Animation](/architecture/ARCH_TILE_ANIMATION) |
| Touch Input | [Touch Input](/architecture/ARCH_TOUCH_INPUT) |
| Extending | [Extending PixelRoot32](/guide/extending) |

---

## Quick Reference: Module Dependencies

```
Engine
├── SceneManager
│   └── Scene
│       ├── Entity
│       │   ├── Actor
│       │   └── UIElement
│       └── CollisionSystem
├── Renderer
│   ├── DrawSurface (abstract)
│   │   ├── TFT_eSPI_Drawer
│   │   ├── U8G2_Drawer
│   │   └── SDL2_Drawer
│   ├── Font (abstract)
│   │   └── Font5x7
│   └── Camera2D
├── InputManager
│   └── InputConfig
├── AudioEngine
│   ├── AudioScheduler (abstract)
│   │   ├── ESP32AudioScheduler
│   │   └── NativeAudioScheduler
│   └── MusicPlayer
└── PlatformCapabilities
```

---

## Performance Optimizations

### Implemented Strategies

1. **Logical vs Physical Resolution**: Rendering at low resolution (e.g., 128x128) with high-performance scaling to physical display (e.g., 240x240).

2. **Scaling Pipeline (v1.0.0)**:
   - **Fast-Path Switching**: Specialized routines for 1:1 and 2x integer scaling
   - **Bit-Expansion LUTs**: OLED horizontal expansion via lookup tables
   - **32-bit Register Writes**: TFT vertical duplication via optimized memcpy

3. **Multi-Core Audio (ESP32)**:
   - Core 0: Audio scheduling and generation
   - Core 1: Main game loop

4. **Mixer LUT**: Lookup tables for mixing without FPU

5. **DMA Pipelining (TFT)**: Double buffering with large block sizes

6. **IRAM-Cached Rendering**: Critical functions in internal RAM

7. **Viewport Culling**: Only render visible entities

### Performance Metrics

- **FPS Target**: 30-60 FPS on ESP32
- **Audio Latency**: < 50ms
- **Memory Footprint**: < 100KB RAM for complete engine
- **Sprite Capacity**: 100+ sprites @ 60fps (logical resolution 128x128)

---

## Configuration and Compilation

### Key Configuration Files

| File | Description |
|------|-------------|
| `platforms/EngineConfig.h` | Global engine configuration |
| `platforms/PlatformDefaults.h` | Platform-specific defaults |
| `platforms/PlatformCapabilities.h` | Hardware detection |
| `graphics/DisplayConfig.h` | Display configuration |
| `input/InputConfig.h` | Input configuration |
| `audio/AudioConfig.h` | Audio configuration |

### Common Compilation Flags

| Flag | Description |
|------|-------------|
| `PLATFORM_ESP32` | Compilation for ESP32 |
| `PLATFORM_NATIVE` | Compilation for PC |
| `PIXELROOT32_ENABLE_DEBUG_OVERLAY` | Enable debug overlay |
| `PIXELROOT32_ENABLE_2BPP_SPRITES` | 2bpp sprite support |
| `PIXELROOT32_ENABLE_4BPP_SPRITES` | 4bpp sprite support |
| `PIXELROOT32_ENABLE_TILEMAP_OPTIMIZATION` | Tilemap optimizations |

---

## Conclusion

PixelRoot32 implements a well-defined layered architecture that enables:

1. **Portability**: 100% portable game code between ESP32 and PC
2. **Modularity**: Independent and replaceable subsystems
3. **Performance**: Specific optimizations for embedded hardware
4. **Extensibility**: Easy addition of new drivers and features
5. **Simplicity**: Intuitive API inspired by Godot Engine

The Scene-Entity architecture provides a familiar programming model for game developers, while the driver abstraction layer enables multi-platform support without sacrificing performance.

---

**Document Generated**: March 2026  
**Engine Version**: v1.1.0
