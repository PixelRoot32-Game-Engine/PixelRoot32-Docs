# AudioScheduler

> **Source:** [PixelRoot32 Game Engine](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine) — see [`ARCH_AUDIO_SUBSYSTEM.md`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/docs/architecture/ARCH_AUDIO_SUBSYSTEM.md) §4.

## Role

**`AudioScheduler`** is the **audio consumer** in the SPSC pipeline: it **dequeues** **`AudioCommand`**s, owns the **four `AudioChannel`** slots, runs **sample-accurate** music stepping, and implements **`generateSamples`** (non-linear mix: FPU or LUT).

**`AudioEngine::generateSamples`** simply forwards to the active scheduler instance.

---

## Implementations

| Scheduler | Typical use | Where `generateSamples` runs |
|-----------|-------------|--------------------------------|
| **`NativeAudioScheduler`** | `PLATFORM_NATIVE` / SDL2 | Dedicated **`std::thread`** pre-mixes into a ring buffer; SDL callback reads mixed PCM via **`AudioEngine::generateSamples`**. |
| **`ESP32AudioScheduler`** | `ESP32` | Same OS context as the **backend audio task** (I2S/DAC); the backend calls **`engine->generateSamples`**. |
| **`DefaultAudioScheduler`** | Unit tests / builds without the above | Whatever thread invokes **`generateSamples`** (e.g. direct callback pull-through). |

**ESP32 note:** **`ESP32AudioScheduler`** does **not** create the FreeRTOS task. **`ESP32_I2S_AudioBackend`** / **`ESP32_DAC_AudioBackend`** call **`xTaskCreatePinnedToCore`** using **`PlatformCapabilities::audioCoreId`** and **`audioPriority`**. Constructor arguments on **`ESP32AudioScheduler`** are reserved; affinity is **not** stored on the scheduler object.

---

## Noise generation (summary)

- **`DefaultAudioScheduler`**: LFSR **every output sample**.
- **`ESP32AudioScheduler`**: Same LFSR polynomial, **clocked** with **`noisePeriodSamples`** / **`noiseCountdown`** from **`AudioEvent::frequency`** (minimum one sample between steps).
- **`NativeAudioScheduler`**: **`rand()`**-based noise path (different from ESP32).

---

## Music sequencer

**`DefaultAudioScheduler`** and **`ESP32AudioScheduler`** cap notes per audio quantum (**`MAX_NOTES_PER_FRAME`**) when catching up; some notes may be skipped under load. **`NativeAudioScheduler`** uses an uncapped catch-up loop (different CPU tradeoff on desktop).

---

## See also

- **[AudioEngine](/api/audio/audio-engine)** — Facade and `AudioConfig`.
- **[MusicPlayer](/api/audio/music-player)** — Produces music **`AudioCommand`**s.
- **[Audio architecture](/architecture/audio-architecture)** — Diagrams and backends.
