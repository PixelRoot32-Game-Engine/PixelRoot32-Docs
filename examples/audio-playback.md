# Audio samples (`snake`, `tic_tac_toe`)

**`flappy_bird` does not use the audio stack** — it is a physics + small-OLED rendering sample only. For **`AudioEngine`**, procedural events, and platform backends, use **`snake`**. For **music tracks** (`MusicPlayer` / note data), use **`tic_tac_toe`** (see `src/assets/music.h` in that project).

| Sample | Audio focus |
|--------|-------------|
| [`snake`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/snake) | **`AudioEvent`** / `playEvent`, SDL2 vs ESP32 I2S (or DAC) backends — [Snake doc](./snake) |
| [`tic_tac_toe`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/tic_tac_toe) | **`MusicPlayer`**, melody data, engine constructed with **`AudioConfig`** — [UI / tic-tac-toe doc](./ui-layout) |

Guide: [Music player](/guide/music-player). API: [AudioEngine](/api/audio/audio-engine), [MusicPlayer](/api/audio/music-player).

Physics on OLED without audio: [`flappy_bird`](./flappy-bird).

See the [samples index](./demos).
