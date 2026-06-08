# Engine sample projects

# PixelRoot32 — Examples

Self-contained **[PlatformIO](https://platformio.org/)** projects that show how to use the engine on **PC (SDL2)** and **ESP32-class boards**. Each folder has its own `**platformio.ini**`, `**src/**` entry point, and `**README.md**` with build flags, supported environments, and documentation links.

**Typical workflow:** open a project folder in PlatformIO (or run CLI from that folder), pick an environment (`native`, `esp32dev`, etc.), then:

```bash
cd <example-folder>
pio run -e <environment>
```

On Windows, `**native**` examples may need local **SDL2** include/lib paths in `platformio.ini` (see comments in [animated_tilemap](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/animated_tilemap)).

The engine revision for each example is defined in `**lib_deps**` inside that example's `platformio.ini` (registry tag vs Git branch).

## Catalogue

- [2048](./2048) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/2048)
- [animated_tilemap](./animated_tilemap) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/animated_tilemap)
- [brick_breaker](./brick_breaker) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/brick_breaker)
- [camera](./camera) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/camera)
- [camera-effect-demo](./camera-effect-demo) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/camera-effect-demo)
- [dual_palette](./dual_palette) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/dual_palette)
- [flappy_bird](./flappy_bird) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/flappy_bird)
- [hello_world](./hello_world) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/hello_world)
- [metroidvania](./metroidvania) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/metroidvania)
- [music_demo](./music_demo) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/music_demo)
- [physics](./physics) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/physics)
- [snake](./snake) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/snake)
- [space_invaders](./space_invaders) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/space_invaders)
- [sprites](./sprites) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/sprites)
- [tic_tac_toe](./tic_tac_toe) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/tic_tac_toe)