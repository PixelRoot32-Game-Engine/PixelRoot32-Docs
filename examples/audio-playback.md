# Audio samples (`snake`, `tic_tac_toe`, `music_demo`)

**`flappy_bird` does not use the audio stack** — it is a physics + small-OLED rendering sample only. For **`AudioEngine`**, procedural events, and platform backends, use **`snake`**. For **single-track** music (`MusicPlayer` / note data), use **`tic_tac_toe`** (see `src/assets/music.h` in that project). For **multi-track** arrangements, **BPM**, and **percussion presets** (`INSTR_KICK` / `SNARE` / `HIHAT`), use **`music_demo`**.

| Sample | Audio focus |
|--------|-------------|
| [`snake`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/snake) | **`AudioEvent`** / `playEvent`, SDL2 vs ESP32 I2S (or DAC) backends — [Snake doc](./snake) |
| [`tic_tac_toe`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/tic_tac_toe) | **`MusicPlayer`**, melody data, engine constructed with **`AudioConfig`** — [UI / tic-tac-toe doc](./ui-layout) |
| [`music_demo`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/music_demo) | **`MusicPlayer`** **multi-track** (`secondVoice` / `thirdVoice` / `percussion`), **`setBPM`**, instrument + drum presets |

Guide: [Music player](/guide/music-player). API: [AudioEngine](/api/audio/audio-engine), [MusicPlayer](/api/audio/music-player).

Physics on OLED without audio: [`flappy_bird`](./flappy-bird).

See the [samples index](./demos).
