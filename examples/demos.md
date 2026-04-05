# Engine sample projects

Official examples live in the [PixelRoot32 Game Engine](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine) repository under [`examples/`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples). Each folder is a **self-contained [PlatformIO](https://platformio.org/)** project: its own `platformio.ini`, `src/` entry point, and `README.md` (build flags, environments, doc links).

**Typical workflow:** open the project folder in PlatformIO (or run CLI from that folder), pick an environment (`native`, `esp32dev`, etc.):

```bash
cd <example-folder>
pio run -e <environment>
```

On Windows, **`native`** builds may need local **SDL2** include/lib paths in `platformio.ini` (see comments in [`animated_tilemap`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/animated_tilemap)).

The engine revision for each sample is pinned in **`lib_deps`** in that folder’s `platformio.ini` (registry tag vs Git branch).

## Catalogue (same as `examples/README.md` in the engine repo)

| Example | What it demonstrates | PlatformIO environments |
|--------|----------------------|-------------------------|
| [`hello_world`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/hello_world) | Minimal `Scene`, `UILabel`, button input, background color cycle | `native`, `esp32dev` |
| [`camera`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/camera) | `Camera2D`, parallax, tile platforms, `KinematicActor` | `native`, `esp32dev` |
| [`dual_palette`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/dual_palette) | Dual palette mode (background vs sprite color tables) | `native`, `esp32dev` |
| [`sprites`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/sprites) | 2bpp / 4bpp sprites and animation | `native`, `esp32dev` |
| [`snake`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/snake) | Grid game, segment pool, `AudioEngine` + platform audio backends | `native`, `esp32dev` |
| [`physics`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/physics) | `RigidActor` / `KinematicActor` / `StaticActor`, touch, optional touch UI (CYD) | `native`, `esp32dev`, `esp32cyd` |
| [`metroidvania`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/metroidvania) | 4bpp tilemaps, `StaticTilemapLayerCache`, platformer player | `native`, `esp32dev` |
| [`animated_tilemap`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/animated_tilemap) | Tile animation, palettes, static tilemap framebuffer cache (reference depth) | `native`, `esp32dev`, `esp32cyd` |
| [`tic_tac_toe`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/tic_tac_toe) | UI, GPIO vs touch, minimax AI, vector board, **`MusicPlayer`** / melody data | `native`, `esp32dev`, `esp32cyd` |
| [`flappy_bird`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/flappy_bird) | Physics flappy clone, U8g2 OLED, ESP32-C3 (**no audio** in this sample) | `native`, `esp32c3` |

## Suggested learning order (from the engine repo)

1. **`hello_world`** — engine init, one scene, text and input.
2. **`sprites`** or **`dual_palette`** — graphics and color models.
3. **`camera`** or **`metroidvania`** / **`animated_tilemap`** — scrolling, tilemaps, caching (read **`animated_tilemap`** for the fullest tilemap write-up).
4. **`physics`** — bodies, sensors, touch.
5. **`snake`** / **`tic_tac_toe`** — small games with **audio** (events vs music). **`flappy_bird`** — physics + OLED, no audio subsystem.

## README template in the repo

Per-example README depth follows **[`animated_tilemap` / README.md](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/examples/animated_tilemap/README.md)** as reference: summary, **Requirements (build flags)**, optional technical notes, **Documentation links**, **Features**, **Build** commands. Scene intent is also described in each `src/*Scene.h` when present.

## Site pages (walkthroughs, not copies of `examples/`)

These pages explain topics and point at real folders above; they are **not** guaranteed to be line-for-line copies of `src/` (except where noted):

- [Entities & scene tutorial](./basic-usage) — didactic composite; **not** a folder under `examples/`.
- [Hello World](./hello-world) — aligns with **`hello_world`** (minimal sample).
- Topic pointers: [Sprites](./sprite-animation), [Physics](./physics-demo), [Tilemaps](./tilemap-scene), [Audio](./audio-playback) (`snake` + `tic_tac_toe`), [UI](./ui-layout), [Flappy Bird](./flappy-bird) (physics, no audio).

## Engine documentation on this site

- [API home](/api/)
- [Architecture overview](/architecture/overview)
