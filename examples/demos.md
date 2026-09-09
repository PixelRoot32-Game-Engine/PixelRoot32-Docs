# Demo projects

Self-contained **[PlatformIO](https://platformio.org/)** projects that show how to use the engine on **PC (SDL2)** and **ESP32-class boards**. Each project has its own `platformio.ini`, `src/` entry point, and `README.md` with build flags, supported environments, and documentation links.

They live in their own repository: [PixelRoot32-Demo-Projects](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects).

**Typical workflow:** open a project folder in PlatformIO (or run the CLI from that folder), pick an environment (`native`, `esp32dev`, etc.), then:

```bash
cd <category>/<demo>
pio run -e <environment>
```

On Windows, `native` builds may need local **SDL2** include/lib paths in `platformio.ini` (see the comments in each project).

The engine revision a demo builds against is defined in `lib_deps` inside that demo's `platformio.ini` (registry tag vs Git branch).

## Catalogue

31 demos across 8 categories.

### Getting Started

- [First Sprite](./getting_started/first_sprite/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/getting_started/first_sprite)
- [Hello World](./getting_started/hello_world/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/getting_started/hello_world)

### Graphics

- [Depth Sort](./graphics/depth_sort/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/graphics/depth_sort)
- [Iso Dungeon](./graphics/iso_dungeon/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/graphics/iso_dungeon)
- [Iso Tilemap Export](./graphics/iso_tilemap_export/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/graphics/iso_tilemap_export)
- [Palette Swap](./graphics/palette_swap/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/graphics/palette_swap)
- [Particles](./graphics/particles/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/graphics/particles)

### Input

- [Digital Buttons](./input/digital_buttons/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/input/digital_buttons)
- [Touch Controls](./input/touch_controls/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/input/touch_controls)

### Audio

- [Music Sequencer](./audio/music_sequencer/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/audio/music_sequencer)
- [SFX Bank](./audio/sfx_bank/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/audio/sfx_bank)

### Gameplay

- [Metroidvania](./gameplay/metroidvania/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/gameplay/metroidvania)
- [Object Pool](./gameplay/object_pool/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/gameplay/object_pool)
- [Room Screen](./gameplay/room_screen/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/gameplay/room_screen)
- [State Machine](./gameplay/state_machine/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/gameplay/state_machine)

### UI

- [HUD Widgets](./ui/hud_widgets/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/ui/hud_widgets)
- [Menu Navigation](./ui/menu_navigation/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/ui/menu_navigation)

### Performance

- [Dirty Regions](./performance/dirty_regions/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/performance/dirty_regions)
- [Memory Budget](./performance/memory_budget/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/performance/memory_budget)

### Games

- [2048](./games/2048/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/games/2048)
- [Bomberbot](./games/bomberbot/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/games/bomberbot)
- [Brick Breaker](./games/brick_breaker/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/games/brick_breaker)
- [Chess](./games/chess/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/games/chess)
- [Flappy Bird](./games/flappy_bird/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/games/flappy_bird)
- [Legend Of Clone](./games/legend_of_clone/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/games/legend_of_clone)
- [Midway Clone](./games/midway_clone/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/games/midway_clone)
- [Pong](./games/pong/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/games/pong)
- [Snake](./games/snake/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/games/snake)
- [Space Invaders](./games/space_invaders/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/games/space_invaders)
- [Tic Tac Toe](./games/tic_tac_toe/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/games/tic_tac_toe)
- [Top Down City](./games/top_down_city/) — [source code](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects/tree/main/games/top_down_city)
