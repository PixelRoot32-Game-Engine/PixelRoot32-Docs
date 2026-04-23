# Audio subsystem

> **Source:** Ported from the [PixelRoot32 Game Engine](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine) repository. Cross-links were adjusted for this site.

# PixelRoot32 / PR32: NES-like Audio System – Implementation and Usage

This document describes how the NES-style audio subsystem is implemented in the
PixelRoot32 (PR32) engine and how to use it from your games. It covers both the
high-level architecture and the concrete implementation details.

> **Current engine:** **`ApuCore`** owns the **four channels**, the **SPSC `AudioCommandQueue`**, **mixing** (FPU compressor + optional HPF, or **LUT** on no-FPU ESP32), **music sequencing**, and **LFSR noise** on all platforms. **`AudioEngine`** is a facade; **`DefaultAudioScheduler`**, **`ESP32AudioScheduler`**, and **`NativeAudioScheduler`** only choose **execution context**. Authoritative mirror: engine [`ARCH_AUDIO_SUBSYSTEM.md`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/docs/architecture/ARCH_AUDIO_SUBSYSTEM.md).

- The system focuses on:
  - Being **deterministic** and low-cost in terms of CPU and RAM.
  - Respecting the existing engine architecture (`core`, `drivers`, `examples`) and the style guide.
  - Providing a **platform-agnostic** audio API:
    - Consistent with `Engine`, `Renderer`, and `InputManager`.
    - With implementations for ESP32 (I2S and DAC) and SDL2 (desktop).
  - Avoiding unnecessary complexity:
    - No exact emulation of the NES APU.
    - No heavy external audio libraries.
    - No breaking changes for existing games in `examples`.

---

## 1. Overview

- 4 fixed channels:
  - 2 `PULSE` channels (square wave with configurable duty cycle).
  - 1 `TRIANGLE` channel.
  - 1 `NOISE` channel.
- Software mixing into a **mono** 16-bit (`int16_t`) stream.
- **Event-driven** model: games fire short-lived `AudioEvent` instances (SFX, notes).
- **Conditionally compiled**: Entire subsystem can be excluded with `PIXELROOT32_ENABLE_AUDIO=0` to save firmware size and RAM.
- Fully **platform-agnostic** core:
  - Wave, mixing, music timing, and the command queue live in **`ApuCore`**.
  - Backends (SDL2, ESP32 I2S/DAC) only pull PCM via **`AudioEngine::generateSamples`**.

Main files:

- Facade: [`audio/AudioEngine.h`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/include/audio/AudioEngine.h)
- Shared core: [`audio/ApuCore.h`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/include/audio/ApuCore.h), [`src/audio/ApuCore.cpp`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/src/audio/ApuCore.cpp)
- Audio types: [`audio/AudioTypes.h`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/include/audio/AudioTypes.h)
- SDL2 backend: [`SDL2_AudioBackend`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/include/drivers/native/SDL2_AudioBackend.h)
- ESP32 I2S backend: [`ESP32_I2S_AudioBackend`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/include/drivers/esp32/ESP32_I2S_AudioBackend.h)
- ESP32 DAC backend: [`ESP32_DAC_AudioBackend`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/include/drivers/esp32/ESP32_DAC_AudioBackend.h)

---

## 2. Internal data model

### 2.1 Basic types

Defined in [`AudioTypes.h`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/include/audio/AudioTypes.h):

```cpp
enum class WaveType {
    PULSE,
    TRIANGLE,
    NOISE
};
```

`WaveType` defines the waveform type for each channel.

### 2.2 AudioChannel

Each channel is an **`AudioChannel`** owned by **`ApuCore`** (fixed array of four). See **[`AudioTypes.h`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/include/audio/AudioTypes.h)** for the full struct: float oscillator state (**`phase`**, **`phaseIncrement`**, volumes, **`dutyCycle`**), **fixed-point mirrors** (**`phaseQ32`**, **`phaseIncQ32`**, **`dutyCycleQ32`**) for the no-FPU mixing path, **NES-style LFSR** fields (**`lfsrState`**, **`noisePeriodSamples`**, **`noiseCountdown`**), and **`remainingSamples`** for sample-accurate note/SFX lifetime.

Key characteristics:

- **No dynamic allocation**: four channels in **`ApuCore`**.
- **Noise** is **deterministic** on every platform (same LFSR polynomial); no `rand()` in the audio path.
- **Retrigger**: short **fade-in** on new events reduces clicks; FPU path adds a **one-pole HPF** after the mix.

### 2.3 AudioEvent

Also defined in `AudioTypes.h`:

```cpp
struct AudioEvent {
    WaveType type;
    float frequency;
    float duration; // seconds
    float volume;   // 0.0 - 1.0
    float duty;     // only for PULSE
    uint8_t noisePeriod = 0; // NOISE: 0 = from frequency, >0 = fixed LFSR period
    const struct InstrumentPreset* preset = nullptr; // static/constexpr/global; nullptr = legacy ADSR
};
```

- It is the basic unit used to trigger a sound.
- It is passed as a parameter to `AudioEngine::playEvent`.
- **Note**: Only available when `PIXELROOT32_ENABLE_AUDIO=1`

---

## 3. AudioEngine and ApuCore: mixing core

[`AudioEngine`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/include/audio/AudioEngine.h) forwards **`generateSamples`** to the active scheduler, which delegates to **[`ApuCore`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/include/audio/ApuCore.h)**.

### 3.1 Channel initialization

**`ApuCore`** constructs:

- `channels[0]` and `channels[1]` → `WaveType::PULSE`
- `channels[2]` → `WaveType::TRIANGLE`
- `channels[3]` → `WaveType::NOISE`

Each channel is reset via **`AudioChannel::reset()`**.

**Note**: This entire subsystem is only compiled when `PIXELROOT32_ENABLE_AUDIO=1`.

### 3.2 Lifetime and time model (Sample-Based)

The audio system no longer uses `deltaTime` or frame-based updates. Instead, it uses **sample-accurate timing** managed by an `AudioScheduler`:

- **Audio Time**: Internal unit is samples (e.g., 1 second = 44100 samples at 44.1kHz).
- **Decoupled Logic**: The `AudioScheduler` runs in a separate thread (SDL2) or core (ESP32).
- **Lifetime**: For each active `AudioChannel`, **`ApuCore::generateSamples`** subtracts 1 from `remainingSamples` for every PCM sample produced (whichever thread/task invokes **`AudioEngine::generateSamples`** through the scheduler).
- When `remainingSamples` reaches 0, the channel is automatically disabled.

Important:

- **Game logic** runs at its own frame rate (e.g., 60 FPS).
- **Audio generation** runs at the hardware sample rate (e.g., 22050 Hz).
- Render stalls or frame drops **do not affect** audio pitch or tempo.

### 3.3 Per-channel sample generation

Oscillators are implemented in **`ApuCore::generateSampleForChannel`** (float path) and in an **integer inner loop** inside **`ApuCore::generateSamples`** on no-FPU ESP32 builds. After the raw waveform sample, the **float path** applies an **ADSR envelope** (from **`InstrumentPreset`** when **`AudioEvent::preset`** is set, else short legacy attack/release), then **LFO** modulation on pitch or volume when enabled. **`NOISE`** uses the same **15-bit LFSR** everywhere, clocked with **`noisePeriodSamples`** / **`noiseCountdown`**.

Per-channel samples are scaled by **`MIXER_SCALE` (0.4)** before the global **compressor** `mixed = sum / (1 + |sum| * 0.5)` (FPU) or the equivalent **`audio_mixer_lut`** path (C3). **Master volume** applies after that. The old **`12000.0f`** scaling is **not** used in current code.

### 3.4 Mixing all channels (Non-Linear Mixer)

`void ApuCore::generateSamples(int16_t* stream, int length)` (invoked via **`AudioEngine::generateSamples`**):

The system uses a **non-linear mixing strategy** that adapts to the underlying hardware to maximize volume and quality while preventing digital clipping.

#### Strategy A: Floating-Point Soft Clipping (FPU-enabled)

Used on ESP32, ESP32-S3, and Native (SDL2). It applies a compression curve:
`Output = Sum / (1.0 + |Sum| * 0.5)`

- Each channel is scaled by **0.4x**.
- Peak volume reaches ~88% of the dynamic range.
- Provides a natural "analog" saturation.

#### Strategy B: Look-Up Table (LUT) Mixing (No-FPU / ESP32-C3)

Used on architectures without floating-point units.

- Channels are summed using `int32_t`.
- A precomputed **1025-entry LUT** (`AudioMixerLUT.h`) maps the 32-bit sum to a 16-bit compressed value.
- Calculated as: `index = (sum + 131072) >> 8`.
- Zero CPU overhead for floating-point math.

#### Clipping Prevention

The asymptotic nature of the curve ensures that the output **never** exceeds the `int16_t` limits, eliminating the need for hard clipping and reducing harmonic distortion.

#### Volume Optimization (v1.2.2+)

- **Q16 Fixed-Point Volume**: Master volume is pre-computed as Q16 fixed-point for faster LUT mixing path on no-FPU architectures (ESP32-C3). This eliminates floating-point operations during the mixing hot path.
- **ESP32 I2S Buffer**: The I2S DMA buffer size is increased to 1024 samples to match native configuration and improve audio stability on ESP32.

### 3.5 Event playback: playEvent

`void AudioEngine::playEvent(const AudioEvent& event)`:

- Now acts as a **Command Producer**.
- It enqueues an `AudioCommand` into a lock-free **Single Producer / Single Consumer (SPSC)** queue.
- **`ApuCore`** (running on Core 0 / audio thread / test thread) consumes this command and:
  - Looks for a free channel of the requested type (`WaveType`).
  - Applies **voice stealing** if necessary (using the channel with the smallest `remainingSamples`).
  - Converts the event's duration (seconds) into `remainingSamples` based on the current sample rate.
  - Initializes the channel state (`enabled`, `frequency`, `phase`, `volume`, etc.).

---

## 4. Audio Schedulers and Backends

The system uses a decoupled architecture: **`ApuCore`** owns audio state and timing logic; an **`AudioScheduler`** selects **when** `ApuCore::generateSamples` runs; an **`AudioBackend`** outputs PCM.

### 4.1 AudioScheduler

The **`AudioScheduler`** interface wires **`submitCommand`** / **`generateSamples`** to **`ApuCore`** and exposes **`isMusicPlaying()`** / **`isMusicPaused()`** on stock implementations.

There are **three** main implementations:

- **`NativeAudioScheduler`**: SDL2 / `PLATFORM_NATIVE`. Dedicated **`std::thread`** + ring buffer.
- **`ESP32AudioScheduler`**: ESP32. Same context as the backend audio task.
- **`DefaultAudioScheduler`**: Unit tests and callback-driven hosts.

#### 4.1.1 Platform-Agnostic Core Management

The system no longer uses hardcoded core IDs for ESP32. Instead, it uses a `PlatformCapabilities` (`pixelroot32::platforms`) structure to detect hardware features at startup:

- **Dual-Core ESP32**: Audio task is pinned to **Core 0** (leaving Core 1 for the game loop).
- **Single-Core ESP32**: Audio task runs on **Core 0** with high priority, allowing the FreeRTOS scheduler to manage time-slicing.
- **Native (SDL2)**: Uses a standard system thread.

### 4.2 Platform Configuration and Build Flags

The audio system behavior can be customized via `platforms/PlatformDefaults.h` or compile-time flags.

#### 4.2.1 Core Affinity

- `PR32_DEFAULT_AUDIO_CORE`: Defines the default core for audio processing (Default: `0` on ESP32).
- `PR32_DEFAULT_MAIN_CORE`: Defines the default core for the main engine loop (Default: `1` on ESP32).

#### 4.2.2 Build Flags

| Flag | Default | Description |
|------|---------|-------------|
| `PIXELROOT32_ENABLE_AUDIO` | `1` | Master switch: when `0`, the whole audio subsystem (engine APIs, **`ApuCore`**, backends used by audio) is excluded from the build. |
| `PIXELROOT32_NO_DAC_AUDIO` | — | Disables the internal DAC backend on classic ESP32. |
| `PIXELROOT32_NO_I2S_AUDIO` | — | Disables the I2S audio backend. |

Display-related compile flags (e.g. U8G2, TFT_eSPI) live with platform docs: [Platform configuration](../guide/platform-config.md).

### 4.3 Audio Backends (interface)

Backends implement the abstract `AudioBackend` interface:

```cpp
class AudioBackend {
public:
    virtual ~AudioBackend() = default;
    virtual void init(AudioEngine* engine, const pixelroot32::platforms::PlatformCapabilities& caps) = 0;
    virtual int getSampleRate() const = 0;
};
```

**Note**: Audio backends are only compiled and available when `PIXELROOT32_ENABLE_AUDIO=1`.

### 4.4 SDL2 backend (Windows / Linux / Mac)

Implemented in:

- Header: [`include/drivers/native/SDL2_AudioBackend.h`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/include/drivers/native/SDL2_AudioBackend.h)
- Source: [`src/drivers/native/SDL2_AudioBackend.cpp`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/src/drivers/native/SDL2_AudioBackend.cpp)

Key points:

- Uses `SDL_OpenAudioDevice` to open a mono device (`AUDIO_S16SYS`, 1 channel).
- Sets up a C callback (`SDLAudioCallbackWrapper`) that calls the member function
  `SDL2_AudioBackend::audioCallback`.
- In `audioCallback`:
  - Computes how many 16-bit samples are required from `len` (bytes).
  - Calls `engineInstance->generateSamples(...)` to fill the buffer directly.

This completely decouples **audio timing** from the SDL2 game loop.

### 4.5 ESP32 Backends

The engine provides two distinct backends for ESP32, allowing developers to choose between high-quality I2S (external DAC) or retro-style internal DAC.

#### A) ESP32 I2S Backend (External DAC)

- **Class**: `ESP32_I2S_AudioBackend`
- **Header**: [`include/drivers/esp32/ESP32_I2S_AudioBackend.h`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/include/drivers/esp32/ESP32_I2S_AudioBackend.h)
- **Use case**: High-quality audio using external DACs like **MAX98357A** or **PCM5102**.
- **Key points**:
  - Uses ESP32 **I2S** peripheral with DMA (`I2S_NUM_0`).
  - Output is digital I2S (BCLK, LRCK, DOUT).
  - Runs in a dedicated FreeRTOS task to ensure smooth playback.
  - Supports standard sample rates (e.g., 22050Hz, 44100Hz).

#### B) ESP32 DAC Backend (Internal DAC)

- **Class**: `ESP32_DAC_AudioBackend`
- **Header**: [`include/drivers/esp32/ESP32_DAC_AudioBackend.h`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/include/drivers/esp32/ESP32_DAC_AudioBackend.h)
- **Use case**: Retro audio using the ESP32's **internal 8-bit DAC** (GPIO 25 or 26), either
  driving a small speaker directly or feeding a simple amplifier like **PAM8302A**.
- **Key points**:
  - Uses the legacy **I2S driver** in **`I2S_MODE_DAC_BUILT_IN`**: **`i2s_write`** pushes blocks to the internal DAC via **DMA** (not per-sample **`dacWrite()`**).
  - A FreeRTOS task (created by the backend) calls **`AudioEngine::generateSamples`**, converts signed PCM to **offset-binary** for the DAC path, and applies **~0.7×** headroom before **`i2s_write`** (PAM8302A-friendly).
  - **Hardware**: internal DAC exists on **classic ESP32** / **ESP32-S2** class chips, not **S3** / **C3**.
- **Limitations**: 8-bit effective resolution; more noise than external I2S.
- **Recommendation**: For higher fidelity, use **`ESP32_I2S_AudioBackend`** + external codec.

#### C) Reference Pinout (ESP32)

| Backend | Peripheral | ESP32 Pin | Module Connection |
|---------|------------|-----------|-----------------|
| **DAC** | DAC1 | GPIO 25 | **PAM8302A**: A+ (IN+) |
| **DAC** | GND | GND | **PAM8302A**: A- (IN-) |
| **I2S** | BCLK | GPIO 26 | **MAX98357A**: BCLK |
| **I2S** | LRCK | GPIO 25 | **MAX98357A**: LRC (WS) |
| **I2S** | DOUT | GPIO 22 | **MAX98357A**: DIN |

### 4.6 Backend Configuration (in `main.cpp`)

To select a backend, simply instantiate the desired class and pass it to the `AudioConfig` struct.

**Example for Internal DAC (PAM8302A):**

```cpp
// 1. Instantiate the backend (GPIO 25, 11025Hz for retro feel)
pr32::drivers::esp32::ESP32_DAC_AudioBackend audioBackend(25, 11025);

// 2. Configure the engine
pr32::audio::AudioConfig audioConfig;
audioConfig.backend = &audioBackend;

// 3. Initialize engine
pr32::core::Engine engine(displayConfig, inputConfig, audioConfig);
```

**Example for I2S (MAX98357A):**

```cpp
// 1. Instantiate the backend (BCLK=26, LRCK=25, DOUT=22)
pr32::drivers::esp32::ESP32_I2S_AudioBackend audioBackend(26, 25, 22, 22050);

// 2. Configure the engine
pr32::audio::AudioConfig audioConfig;
audioConfig.backend = &audioBackend;

// 3. Initialize engine
pr32::core::Engine engine(displayConfig, inputConfig, audioConfig);
```

Advantages:

- Audio is generated in a dedicated task, independent from the game frame rate.
- The game loop can run at 60 FPS even while audio is streamed at 22050 Hz.

---

## 5. Integration with Engine and the game loop

The central `Engine` is responsible for:

- Creating the `AudioEngine` instance.
- Providing an `AudioConfig` with the appropriate backend and scheduler.
- Managing the lifecycle of the audio subsystem.

See [`core/Engine.h`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/include/core/Engine.h) and
[`core/Engine.cpp`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/src/core/Engine.cpp).

**Decoupled flow:**

1. The game creates `DisplayConfig`, `InputConfig`, and `AudioConfig`.
2. It constructs `Engine(displayConfig, inputConfig, audioConfig)`.
3. It calls `engine.init()`:
   - Initializes renderer, input, and audio.
   - The audio scheduler starts its dedicated thread/task.
4. On each frame:
   - `Engine::update`:
     - Computes `deltaTime`.
     - Updates input.
     - Calls `sceneManager.update(deltaTime)`.
     - **Note**: `AudioEngine` and `MusicPlayer` no longer need frame updates.
   - `Engine::draw`:
     - Renders the scene.

Meanwhile, the **Audio Scheduler** (Core 0 / Thread) runs independently at the target sample rate.

---

## 6. Using audio from a game

### 6.1 Accessing the AudioEngine

From any scene or actor that has access to `Engine`:

```cpp
auto& audio = engine.getAudioEngine();
```

### 6.2 Triggering a simple sound

Example of a “coin” sound when the player passes an obstacle in GeometryJump
([`GeometryJumpScene.cpp`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples)):

```cpp
pr32::audio::AudioEvent coinEvent{};
coinEvent.type = pr32::audio::WaveType::PULSE;
coinEvent.frequency = 1500.0f;
coinEvent.duration = 0.12f;
coinEvent.volume = 0.8f;
coinEvent.duty = 0.5f;
engine.getAudioEngine().playEvent(coinEvent);
```

Recommended patterns:

- Use `PULSE` for “blip”, “coin”, jumps, and UI sounds.
- Use `TRIANGLE` for bass lines or softer tones.
- Use `NOISE` for hits, explosions, and collisions.

### 6.2.1 Global master volume

Games can control a global volume multiplier without changing individual events:

```cpp
auto& audio = engine.getAudioEngine();

audio.setMasterVolume(0.5f); // 50% of full volume
// ...
float current = audio.getMasterVolume(); // Query current setting
```

- `setMasterVolume` clamps the value to `[0.0f, 1.0f]`.
- It scales all channels uniformly on top of each event’s own `volume`.

### 6.3 Designing NES-like effects

Effects are built by combining basic parameters and optional ADSR envelopes:

**Basic Parameters**
- `frequency`: lower or higher pitch.
- `duration`: effect length (seconds).
- `volume`: 0.0–1.0.
- `duty` (pulse only):
  - 0.125: thinner, sharper timbre.
  - 0.25: classic "NES lead".
  - 0.5: symmetric square, "fatter" sound.

**ADSR Envelope (via `InstrumentPreset`)**
- `attackTime`: how quickly the sound reaches peak volume (0.0 = instant).
- `decayTime`: how quickly it drops to sustain level after attack.
- `sustainLevel`: volume maintained during the sustain phase (0.0-1.0).
- `releaseTime`: how quickly the sound fades after duration ends.

Use an `InstrumentPreset` with an `AudioEvent` to apply envelopes:
```cpp
AudioEvent evt{};
evt.type = WaveType::PULSE;
evt.frequency = 1500.0f;
evt.duration = 0.12f;
evt.preset = &INSTR_PULSE_LEAD;  // Uses built-in ADSR envelope
audio.playEvent(evt);
```

---

## 7. Melody subsystem (tracks and songs)

The audio system also includes a lightweight melody/music layer built on top of
`AudioEngine`. It is designed to stay simple and deterministic, while being easy
to use from games.

### 7.1 Data model (`AudioMusicTypes.h`)

Defined in [`AudioMusicTypes.h`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/include/audio/AudioMusicTypes.h):

```cpp
enum class Note : uint8_t {
    C = 0, Cs, D, Ds, E, F, Fs, G, Gs, A, As, B,
    Rest,
    COUNT
};
```

- `Note::Rest` represents a silence.
- Frequencies are derived from an internal table for octave 4 combined with
  power-of-two shifts:

```cpp
inline float noteToFrequency(Note note, int octave);
```

Melodies are sequences of `MusicNote` elements:

```cpp
struct MusicNote {
    Note note;
    uint8_t octave;               // 0-8 (for percussion: 1=Kick, 2=Snare, 3+=Hi-HAT)
    float duration;               // seconds
    float volume;                 // 0.0 - 1.0
    const InstrumentPreset* preset = nullptr;  // Optional preset for ADSR/LFO per-note
};
```

A `MusicTrack` groups notes and defines how they are played. **Multi-track:** optional pointers add up to **three** parallel layers (same **`MAX_MUSIC_TRACKS` = 4** total including the root):

```cpp
struct MusicTrack {
    const MusicNote* notes;
    size_t count;
    bool loop;
    WaveType channelType;
    float duty;
    const MusicTrack* secondVoice = nullptr;
    const MusicTrack* thirdVoice = nullptr;
    const MusicTrack* percussion = nullptr;
};
```

For convenience there are **instrument** presets (melodic and **percussion**) and helpers:

```cpp
struct InstrumentPreset {
    // Basic parameters
    float baseVolume;
    float duty;           // 0.0 = NOISE (percussion), >0 = PULSE/TRIANGLE
    uint8_t defaultOctave;
    float defaultDuration = 0.0f;  // 0.0 = use note.duration, >0 = fixed (percussion)
    uint8_t noisePeriod = 0;        // 0 = calc from freq, >0 = direct LFSR period
    
    // ADSR Envelope
    float attackTime = 0.002f;      // Attack time in seconds
    float decayTime = 0.0f;         // Decay time in seconds
    float sustainLevel = 1.0f;      // Sustain level (0.0-1.0)
    float releaseTime = 0.005f;     // Release time in seconds
    
    // LFO Modulation
    LfoTarget lfoTarget = LfoTarget::NONE;  // NONE, PITCH, or VOLUME
    float lfoFrequency = 0.0f;      // LFO frequency in Hz
    float lfoDepth = 0.0f;          // Modulation depth
    float lfoDelay = 0.0f;          // Delay before LFO starts
    
    // Waveform refinements
    bool noiseShortMode = false;    // Metallic 93-step LFSR for NOISE
    float dutySweep = 0.0f;         // Duty cycle change per second (PWM)
};

inline MusicNote makeNote(const InstrumentPreset& preset, Note note, float duration);
inline MusicNote makeNote(const InstrumentPreset& preset, Note note, uint8_t octave, float duration);
inline MusicNote makeRest(float duration);
```

**Built-in `constexpr` presets** — full initializer lists live only in the header (do not rely on abbreviated copies). Melodic: **`INSTR_PULSE_LEAD`**, **`INSTR_PULSE_HARMONY`**, **`INSTR_PULSE_PAD`**, **`INSTR_PULSE_BASS`**, **`INSTR_TRIANGLE_LEAD`**, **`INSTR_TRIANGLE_PAD`**, **`INSTR_TRIANGLE_BASS`**. Percussion (use with **`WaveType::NOISE`**, **`duty == 0`**): **`INSTR_KICK`**, **`INSTR_SNARE`**, **`INSTR_HIHAT`**. See [`AudioMusicTypes.h`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/include/audio/AudioMusicTypes.h) and the engine [API audio reference](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/docs/api/API_AUDIO.md#predefined-presets) for roles and parameters.

These helpers reduce boilerplate when defining tracks and keep note volumes and octaves consistent per instrument.

#### 7.1.1 NES-style tick timing

Inside **`ApuCore`**, the music sequencer advances in **ticks** derived from **audio sample time** and the current **BPM** (default **150**, **4 ticks per beat**), scaled by **`MUSIC_SET_TEMPO`**. Ticks are **not** tied to the game’s render frame rate: tempo stays stable when the main loop stalls, as long as **`generateSamples`** keeps being called on the audio side.

### 7.2 MusicPlayer (`MusicPlayer.h`)

**For a full MusicPlayer integration walkthrough, see the [Music player guide](/guide/music-player).**

Defined in [`MusicPlayer.h`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/include/audio/MusicPlayer.h) and
[`MusicPlayer.cpp`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/src/audio/MusicPlayer.cpp).

**Responsibilities (thin client):**

- Acts as a **command producer** for the music system.
- Provides **`play` / `stop` / `pause` / `resume`**, **`setTempoFactor`**, **`setBPM` / `getBPM`**, and **`getActiveTrackCount`** (layers requested on the last **`play()`**).
- Enqueues **`AudioCommand`**s through **`AudioEngine::submitCommand`**; schedulers forward them to **`ApuCore`**.

**Sequencing (audio consumer):**

- Tick-based sequencing runs in **`ApuCore::updateMusicSequencer`** (same code path on every platform).
- Uses **sample-accurate** wall time instead of `deltaTime`.
- Emits internal **`AudioEvent`s** via **`executePlayEvent`** on the audio consumer thread/context.

### 7.3 Integration with Engine

`MusicPlayer` is owned by `Engine` alongside `AudioEngine`:

- The `Engine` constructor creates `audioEngine` and `musicPlayer`.
- Games use:

```cpp
auto& music = engine.getMusicPlayer();
music.play(myTrack);
```

This keeps music sequencing **sample-accurate** and completely independent of the game frame rate. Render stalls or logic spikes will not cause music to jitter or slow down.

### 7.4 Example: looping lead + reference sample

A minimal looping lead (additional layers optional via **`secondVoice`** / **`percussion`**):

```cpp
using namespace pixelroot32::audio;

static const MusicNote MELODY_NOTES[] = {
    makeNote(INSTR_PULSE_LEAD, Note::C, 0.20f),
    makeNote(INSTR_PULSE_LEAD, Note::E, 0.20f),
    makeNote(INSTR_PULSE_LEAD, Note::G, 0.25f),
    makeRest(0.10f),
};

static const MusicTrack GAME_MUSIC = {
    MELODY_NOTES,
    sizeof(MELODY_NOTES) / sizeof(MusicNote),
    true,
    WaveType::PULSE,
    0.5f,
};

void MyScene::init(pr32::core::Engine& engine) {
    engine.getMusicPlayer().play(GAME_MUSIC);
}
```

- Each **active** music layer prefers a matching **`WaveType`**; voice allocation and SFX **stealing** still apply across the **four** hardware channels.
- For **multi-track** arrangements, instrument presets, and drum patterns, use the engine sample **[`music_demo`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/music_demo)**.

---

## 8. Current limitations and future extensions

With the **Multi-Core Architecture (v0.7.0-dev)**, many previous limitations were addressed, particularly regarding timing and stability.

### 8.1 Resolved / Improved

- **Sample-Accurate Timing**: The system now uses samples instead of `deltaTime` for all internal logic, eliminating jitter and drift.
- **Decoupled Execution**: Audio logic is completely isolated from the game's frame rate, preventing audio stuttering during heavy CPU load.
- **Music tempo control**: real-time changes via **`MUSIC_SET_TEMPO`** and absolute **`MUSIC_SET_BPM`**.
- **Multi-track music**: up to **four** parallel layers (main + three pointers), carried in **`AudioCommand::subTracks`**.
- **ADSR Envelopes**: Full Attack-Decay-Sustain-Release envelopes implemented via `InstrumentPreset` for expressive note articulation and click-free playback.
- **LFO Modulation**: Low-frequency oscillators for vibrato (pitch) and tremolo (volume) effects.

### 8.2 Remaining Limitations

- No exact cycle-accurate emulation of the NES APU.
- **Pitch Sweeps**: Frequency slides (pitch slides) are not yet implemented.
- **Complex Envelopes**: ADSR or complex multi-point envelopes are not supported (only linear interpolation).
- **Music catch-up**: if **`generateSamples`** is not called for a long time, **`updateMusicSequencer`** may process many ticks in one step (CPU scales with backlog; no **`MAX_NOTES_PER_FRAME`** cap in current code).

### 8.3 Future Extensions

- ~~**Deterministic LFSR everywhere**~~: ✅ Implemented in **`ApuCore`** (including native builds).
- **Frequency Sweeps**: Add `frequencyDelta` (or NES-style sweep unit) to **`ApuCore`** for pitch slides.
- **High-Level SFX Helpers**: Add methods like `playJumpSfx()`, `playExplosionSfx()` to `AudioEngine` for easier use.
- **Advanced music tooling**: pattern tables, FMS-style expansion, or streaming from flash without large static arrays.
- **SIMD Optimizations**: Investigate SSE/AVX for native platforms and DSP instructions for ESP32-S3 (see research document).

---

## 9. Summary

- The NES-like audio system in PixelRoot32:
  - Uses 4 static channels (2 Pulse, 1 Triangle, 1 Noise).
  - Produces mono 16-bit audio via software mixing.
  - Is platform-agnostic thanks to `AudioBackend`, `AudioScheduler`, and shared **`ApuCore`** logic.
  - Is **decoupled** from the game loop, running on Core 0 (ESP32) or a separate thread (SDL2).
  - Uses **sample-accurate timing** for both SFX and music inside **`ApuCore`**.
  - Is controlled from games through `AudioEngine` (SFX) and `MusicPlayer` (Music) via a lock-free **SPSC** command queue (**128** slots; overflow drops newest).
