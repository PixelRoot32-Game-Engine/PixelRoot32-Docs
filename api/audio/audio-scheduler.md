# AudioScheduler

> **Source:** [PixelRoot32 Game Engine](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine) — see [`ARCH_AUDIO_SUBSYSTEM.md`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/docs/architecture/ARCH_AUDIO_SUBSYSTEM.md) §4 and [`ApuCore.h`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/include/audio/ApuCore.h).

## Role

**`AudioScheduler`** chooses **when** the audio consumer runs. In all stock implementations it owns an **`ApuCore`** instance and forwards **`submitCommand`** / **`generateSamples`** to it.

**`ApuCore`** is the real **consumer** in the SPSC pipeline: it **dequeues** **`AudioCommand`**s, owns the **four `AudioChannel`** slots, runs **sample-accurate** music stepping, and implements **mixing** (non-linear compressor: FPU path or **LUT** on no-FPU ESP32, e.g. ESP32-C3). Optional **one-pole HPF** runs on the FPU / native float path after the mix.

**`AudioEngine::generateSamples`** forwards to **`AudioScheduler::generateSamples`**, which calls **`ApuCore::generateSamples`**.

Stock implementations also override **`isMusicPlaying()`** / **`isMusicPaused()`** to expose **`ApuCore`** transport atomics.

---

## Implementations

| Scheduler | Typical use | Where `ApuCore::generateSamples` runs |
|-----------|-------------|----------------------------------------|
| **`NativeAudioScheduler`** | `PLATFORM_NATIVE` / SDL2 (not unit tests) | Dedicated **`std::thread`** fills a ring buffer; SDL callback drains via **`AudioEngine::generateSamples`**. |
| **`ESP32AudioScheduler`** | `ESP32` | Same OS context as the **backend audio task** (I2S/DAC); backend calls **`engine->generateSamples`**. |
| **`DefaultAudioScheduler`** | Unit tests / minimal hosts | Whatever thread invokes **`generateSamples`**. |

**ESP32 note:** **`ESP32AudioScheduler`** does **not** create the FreeRTOS task. **`ESP32_I2S_AudioBackend`** / **`ESP32_DAC_AudioBackend`** call **`xTaskCreatePinnedToCore`** using **`PlatformCapabilities::audioCoreId`** and **`audioPriority`**. Constructor arguments on **`ESP32AudioScheduler`** are reserved; affinity is **not** stored on the scheduler object.

---

## Noise generation (unified)

All platforms use the same **15-bit NES-style LFSR** and **`noisePeriodSamples` / `noiseCountdown`** stepping model inside **`ApuCore`**. There is **no** `rand()` path in current engine code.

---

## Music sequencer

Tick-based sequencing lives in **`ApuCore::updateMusicSequencer`**. If **`generateSamples`** is not invoked for a long wall-clock gap, many ticks may be processed in one call (CPU scales with backlog; there is no **`MAX_NOTES_PER_FRAME`** cap in the current implementation).

---

## See also

- **[AudioEngine](/api/audio/audio-engine)** — Facade and `AudioConfig`.
- **[MusicPlayer](/api/audio/music-player)** — Produces music **`AudioCommand`**s.
- **[Audio architecture](/architecture/audio-architecture)** — Subsystem narrative.
- **Engine:** [`ApuCore.cpp`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/src/audio/ApuCore.cpp) — implementation reference.
