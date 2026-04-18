# AudioEngine

> **Source:** [PixelRoot32 Game Engine](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine) — aligned with [`ARCH_AUDIO_SUBSYSTEM.md`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/docs/architecture/ARCH_AUDIO_SUBSYSTEM.md).

## Role

**`AudioEngine`** is a **facade**: it enqueues **`AudioCommand`**s for the active **`AudioScheduler`** (`playEvent`, `setMasterVolume`, `submitCommand`) and forwards **`generateSamples`** to that scheduler. Stock schedulers delegate to **`ApuCore`**, which owns **mixing**, **channel state**, the **SPSC queue**, and **music sequencing** — not the `AudioEngine` class itself.

---

## AudioEngine

**Header:** `audio/AudioEngine.h` — **Namespace:** `pixelroot32::audio`

### Constructors

- **`AudioEngine(const AudioConfig& config, const PlatformCapabilities& caps = PlatformCapabilities())`**  
  Selects scheduler by platform (`ESP32` → `ESP32AudioScheduler`, native → `NativeAudioScheduler` when not unit testing, else `DefaultAudioScheduler`).

- **`AudioEngine(const AudioConfig& config)`**  
  Equivalent to default `PlatformCapabilities`.

### Methods

- **`void init()`**  
  Initializes the scheduler and backend (`scheduler->init` / `start`, then `backend->init`).

- **`void generateSamples(int16_t* stream, int length)`**  
  Fills PCM output; called from the SDL callback or ESP32 backend task. Delegates to **`AudioScheduler::generateSamples`**.

- **`void playEvent(const AudioEvent& event)`**  
  Enqueues **`PLAY_EVENT`**. The scheduler picks a channel of the matching **`WaveType`**, applies **voice stealing** if needed, and converts **`duration`** to **`remainingSamples`**.

- **`void setMasterVolume(float volume)`**  
  Clamps to **[0, 1]** and enqueues **`SET_MASTER_VOLUME`** (audio thread applies it).

- **`float getMasterVolume() const`**  
  Returns cached value from the game thread side; actual mix uses the scheduler after commands are processed.

- **`void submitCommand(const AudioCommand& cmd)`**  
  Low-level enqueue (music, stop channel, tempo, BPM, etc.).

- **`bool isMusicPlaying() const`** / **`bool isMusicPaused() const`**  
  Read transport flags maintained by **`ApuCore`** (atomics). Use with **`MusicPlayer::isPlaying()`** semantics or custom UI.

- **`void setScheduler(std::unique_ptr<AudioScheduler> scheduler)`**  
  Replaces the scheduler (advanced). Takes **`std::unique_ptr`**, not `shared_ptr`.

### Typical usage

```cpp
auto& audio = engine.getAudioEngine();

AudioEvent evt{};
evt.type = WaveType::PULSE;
evt.frequency = 1500.0f;
evt.duration = 0.12f;
evt.volume = 0.8f;
evt.duty = 0.5f;

audio.playEvent(evt);
```

---

## Data structures

### `WaveType` (enum class)

- **`PULSE`** — Square wave; **`AudioEvent::duty`** active.
- **`TRIANGLE`** — Triangle wave.
- **`NOISE`** — LFSR-based noise; **`frequency`** meaning depends on scheduler (see below).

### `AudioEvent` (struct)

- **`WaveType type`**
- **`float frequency`** — For **PULSE** / **TRIANGLE**: pitch (Hz). For **NOISE**: drives the **LFSR step rate** when **`noisePeriod == 0`** (not a musical pitch).
- **`float duration`** — Seconds.
- **`float volume`** — **[0, 1]**.
- **`float duty`** — Pulse duty **[0, 1]**; unused for triangle/noise.
- **`uint8_t noisePeriod`** — For **NOISE**: **`0`** = derive period from **`frequency`**; **`> 0`** = fixed LFSR period in samples (percussion presets).

### `AudioChannel` (struct, scheduler-owned)

Relevant fields for noise on ESP32 (see engine `AudioTypes.h`):

- **`lfsrState`** — 15-bit NES-style LFSR.
- **`noisePeriodSamples`**, **`noiseCountdown`** — Clock the LFSR on **ESP32** (sub-sample-rate stepping for percussion-like noise).

### `AudioConfig` (struct)

- **`AudioBackend* backend`** — Platform backend instance (SDL2, I2S, DAC); must outlive/engine init as configured in your `main`/setup.
- **`int sampleRate`** — e.g. 22050, 44100.

### Command queue (SPSC)

Commands go through **`AudioCommandQueue`** inside **`ApuCore`**: **128** slots, **single producer / single consumer**. If full, **`enqueue`** fails and the **newest** command is dropped. **`ApuCore::getDroppedCommands()`** counts drops; throttled warnings may appear when **`PIXELROOT32_DEBUG_MODE`** is defined.

---

## See also

- **[AudioScheduler](/api/audio/audio-scheduler)** — Implementations and where mixing runs.
- **[MusicPlayer](/api/audio/music-player)** — **`MusicTrack`** / **`MusicNote`** API.
- **[Audio architecture](/architecture/audio-architecture)** — Full subsystem narrative.
