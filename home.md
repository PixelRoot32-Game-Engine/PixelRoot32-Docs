---
layout: home

hero:
  name: PixelRoot32
  text: Game Engine
  tagline: A lightweight, modular 2D game engine for ESP32 and PC
  image:
    src: /logo.svg
    alt: PixelRoot32 Logo
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine

features:
  - icon: ⚡
    title: High Performance
    details: Optimized for ESP32 with DMA transfers, IRAM-cached rendering, and ~43 FPS on 240×240 displays. Dual numeric backend (float/fixed-point) for variants without FPU.
  
  - icon: 🎮
    title: Godot-Style Architecture
    details: Scene-based entity system with intuitive Scene → Entity → Actor hierarchy. Familiar patterns for developers coming from modern game engines.
  
  - icon: 🎨
    title: Advanced Graphics
    details: 1bpp/2bpp/4bpp sprites with multi-palette, tilemap support with viewport culling, independent resolution scaling, and NES-style rendering.
  
  - icon: 🎵
    title: NES Audio System
    details: Built-in 4-channel audio subsystem (Pulse, Triangle, Noise) with sample-accurate timing. Multi-core audio architecture on ESP32.
  
  - icon: 🏗️
    title: Modular Compilation
    details: Include only what you need with PIXELROOT32_ENABLE_* flags. Reduce firmware size by excluding unused subsystems.
  
  - icon: 💻
    title: Cross-Platform
    details: Develop on PC with SDL2 simulation, deploy on ESP32. Same codebase, same behavior. No hardware needed for prototyping.
---

## Quick Example

Get a game running in minutes:

::: code-group

```cpp [main.cpp]
#include <Engine.h>
#include <Scene.h>

using namespace pixelroot32;

class MyScene : public core::Scene {
public:
    void init() override {
        // Initialize your game objects here
    }
    
    void update(unsigned long deltaTime) override {
        // Game logic runs here
    }
    
    void draw(graphics::Renderer& renderer) override {
        renderer.drawText("Hello PixelRoot32!", 10, 10, 
                         graphics::Color::WHITE, 2);
    }
};

void setup() {
    graphics::DisplayConfig config(240, 240);
    core::Engine engine(std::move(config));
    
    MyScene scene;
    engine.setScene(&scene);
    
    engine.init();
    engine.run();
}

void loop() {} // Engine.run() contains the game loop
```

:::

## Why PixelRoot32?

### Built for Embedded

PixelRoot32 is designed from the ground up for ESP32 microcontrollers. Every subsystem considers memory constraints, flash usage, and real-time performance:

- **Zero-allocation policy** during game loop
- **PROGMEM-aware** data structures for flash storage
- **DMA-accelerated** rendering pipeline
- **Fixed-point math** for FPU-less variants

### Production Ready

- ✅ Stable **v1.1.0** release ([migration notes](/guide/migrations/overview))
- ✅ Large automated test suite (Unity / PlatformIO, native + embedded targets)
- ✅ Active development and community
- ✅ MIT licensed

### Developer Experience

```cpp
// Physics with Godot-style API
auto* player = new KinematicActor(100, 100, 16, 16);
player->setCollisionLayer(DefaultLayers::kPlayer);
player->setCollisionMask(DefaultLayers::kEnvironment);

// Move and slide with collision response
auto collision = player->moveAndSlide(velocity, deltaTime);
if (collision.collides) {
    // Handle collision
}
```

## Architecture Overview

```mermaid
flowchart TD
    subgraph Game["Game Layer (Your Code)"]
        GS[Game Scenes]
    end
    
    subgraph SceneLayer["Scene Layer"]
        E[Engine]
        SM[SceneManager]
        S[Scene]
        EN[Entity]
        A[Actor]
    end
    
    subgraph SystemLayer["System Layer"]
        R[Renderer]
        AE[AudioEngine]
        CS[CollisionSystem]
        UI[UI System]
        IM[InputManager]
    end
    
    subgraph Abstraction["Abstraction Layer"]
        DS[DrawSurface]
        AS[AudioScheduler]
        PM[PlatformMemory]
        Math[Math System]
    end
    
    subgraph Drivers["Driver Layer"]
        TFT[TFT_eSPI]
        U8G2[U8G2 OLED]
        SDL2[SDL2 PC]
    end
    
    GS --> E
    E --> SM
    SM --> S
    S --> EN
    EN --> A
    
    E --> R
    E --> AE
    S --> CS
    S --> UI
    E --> IM
    
    R --> DS
    AE --> AS
    DS --> TFT
    DS --> U8G2
    DS --> SDL2
```

## Platform Support

| Platform | Status | Notes |
|----------|--------|-------|
| ESP32-S3 | ✅ Fully Supported | FPU, optimal performance |
| ESP32-C3 | ✅ Fully Supported | Fixed-point math |
| ESP32-C6 | ✅ Fully Supported | Fixed-point math |
| ESP32 (classic) | ✅ Supported | DAC audio available |
| PC (Windows/Linux/macOS) | ✅ SDL2 | Development & testing |

## Next Steps

- **[Getting Started](/guide/getting-started)** — Install and build your first project
- **[Core Concepts](/guide/core-concepts)** — Understand scenes, entities, and the game loop
- **[Architecture](/architecture/overview)** — Deep dive into the engine design
- **[API reference](/api/)** — Module and class index

---

<p align="center">
  Built with ❤️ for the retro-dev community
</p>
