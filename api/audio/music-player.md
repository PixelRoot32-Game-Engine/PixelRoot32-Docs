# MusicPlayer

> **Source:** Ported from the [PixelRoot32 Game Engine](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine) repository. Cross-links were adjusted for this site.

## Music data structures

Defined in **[`AudioMusicTypes.h`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/include/audio/AudioMusicTypes.h)**.

### `MAX_MUSIC_TRACKS`

- **`constexpr size_t MAX_MUSIC_TRACKS = 4`**: at most **one main** `MusicTrack` plus **three** optional parallel layers (`secondVoice`, `thirdVoice`, `percussion`).

### `MusicNote`

- **`Note note`**: pitch or **`Note::Rest`**.
- **`uint8_t octave`**: octave (0–8). For authored percussion without a per-note preset, octave can act as a drum selector; prefer **`InstrumentPreset`** on the note when possible.
- **`float duration`**: length in **seconds** (unless a percussion preset fixes duration via **`defaultDuration`**).
- **`float volume`**: 0.0–1.0.
- **`const InstrumentPreset* preset`**: optional; **`nullptr`** uses the **`MusicTrack`** layer’s **`channelType`** / **`duty`** with legacy envelope behavior (no per-note preset). When set, **`makeNote`** stores the pointer and the sequencer uses that preset’s ADSR/LFO/wave options; for **percussion** (**`duty == 0`**), the preset drives hit duration (**`defaultDuration`**), **`noisePeriod`**, and the frequency passed into the noise path via **`instrumentToFrequency`**.

### `MusicTrack`

- **`const MusicNote* notes`**, **`size_t count`**, **`bool loop`**.
- **`WaveType channelType`**, **`float duty`**: waveform for that layer (**`NOISE`** + **`duty == 0`** for drum tracks).
- **`const MusicTrack* secondVoice`**, **`thirdVoice`**, **`percussion`**: optional pointers to **other** `MusicTrack` instances (static data). **`nullptr`** disables that layer.

### `InstrumentPreset`

Complete instrument preset with ADSR envelope, LFO modulation, and waveform refinements:

**Basic Parameters**
- **`float baseVolume`**: Default volume for notes (0.0 - 1.0).
- **`float duty`**: Duty cycle for Pulse waves (0.0 - 1.0). For percussion, use 0.0 to select NOISE channel.
- **`uint8_t defaultOctave`**: Default octave. For percussion: 1=Kick, 2=Snare, 3+=Hi-HAT.
- **`float defaultDuration`**: Fixed duration for percussion hits (0.0 = use `note.duration`, >0 = fixed duration).
- **`uint8_t noisePeriod`**: LFSR period for NOISE channel (0 = calculate from frequency, >0 = explicit period).

**ADSR Envelope**
- **`float attackTime`**: Attack time in seconds (0.0 = instant, default 0.002f).
- **`float decayTime`**: Decay time in seconds (0.0 = skip decay, default 0.0f).
- **`float sustainLevel`**: Sustain level as fraction of peak volume (0.0-1.0, default 1.0f).
- **`float releaseTime`**: Release time in seconds (0.0 = instant off, clamped to 100ms max, default 0.005f).

**LFO Modulation**
- **`LfoTarget lfoTarget`**: Modulation target (`NONE`, `PITCH`, or `VOLUME`).
- **`float lfoFrequency`**: LFO frequency in Hz (0.0 = disabled).
- **`float lfoDepth`**: Modulation depth. For PITCH: ratio (e.g., 0.05 for ~0.34 semitones). For VOLUME: fraction (0.0-1.0).
- **`float lfoDelay`**: Delay before LFO starts in seconds.

**Waveform Refinements**
- **`bool noiseShortMode`**: For NOISE channel: true = metallic 93-step LFSR, false = standard 32767-step.
- **`float dutySweep`**: For PULSE channel: duty cycle change per second for PWM-like timbral effects.

**Percussion** presets use **`duty == 0`** (noise path in **`instrumentToFrequency`** / sequencer).

#### Built-in presets

**Melodic**

| Preset | Role |
|--------|------|
| **`INSTR_PULSE_LEAD`** | Main lead pulse, octave 4, duty 0.5 |
| **`INSTR_PULSE_HARMONY`** | Harmony pulse, octave 5, duty 0.125 |
| **`INSTR_PULSE_PAD`** | Atmospheric pad pulse, octave 4, duty 0.25, slow pitch drift |
| **`INSTR_PULSE_BASS`** | Punchy bass pulse, octave 2, duty 0.25 |
| **`INSTR_TRIANGLE_LEAD`** | Smooth triangle lead, octave 5, gentle vibrato |
| **`INSTR_TRIANGLE_PAD`** | Soft atmospheric triangle pad, octave 4, tremolo |
| **`INSTR_TRIANGLE_BASS`** | Triangle bass, octave 3, duty 0.5 |

**Percussion** (use with **`WaveType::NOISE`**; tuned **`defaultDuration`** / **`noisePeriod`**)

| Preset | Role |
|--------|------|
| **`INSTR_KICK`** | Kick: defaultOctave 1, duration 0.12s, noisePeriod 25 |
| **`INSTR_SNARE`** | Snare: defaultOctave 2, duration 0.15s, noisePeriod 50 |
| **`INSTR_HIHAT`** | Hi-hat: defaultOctave 3, duration 0.05s, noisePeriod 12 |

#### Helpers

- **`MusicNote makeNote(const InstrumentPreset& preset, Note note, float duration)`**
- **`MusicNote makeNote(const InstrumentPreset& preset, Note note, uint8_t octave, float duration)`**
- **`MusicNote makeRest(float duration)`**
- **`float instrumentToFrequency(const InstrumentPreset& preset, Note, uint8_t)`** — If **`preset.duty == 0`** (percussion), returns a **fixed noise-clock rate in Hz** for the NOISE channel (**Kick ≈ 80**, **Snare ≈ 150**, **Hi-hat ≈ 3000** from **`defaultOctave`** 1 / 2 / 3+); these control **density/brightness**, not musical pitch like **`noteToFrequency`**. **`Note`** / **`octave`** are ignored for that path. If **`duty > 0`**, the helper is not used for normal melodic sequencing (implementation falls back to **440 Hz**; melodic pitch comes from **`noteToFrequency`** in the music path).

### `AudioCommand` (multi-track)

**[`AudioTypes.h`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/include/audio/AudioTypes.h)** extends **`AudioCommand`** with:

- **`static constexpr size_t MAX_SUB_TRACKS = 3`**
- **`const MusicTrack* subTracks[MAX_SUB_TRACKS]`**
- **`size_t subTrackCount`**

**`MusicPlayer::play`** fills **`track`** with the main `MusicTrack` and pushes non-null **`secondVoice` / `thirdVoice` / `percussion`** into **`subTracks`** in that order.

---

## `MusicPlayer` class

**Inherits:** none.

High-level helper that **enqueues** music-related **`AudioCommand`**s on **`AudioEngine`**. **Sample-accurate**, **tick-based** sequencing runs in **`ApuCore::updateMusicSequencer`** on the audio consumer path (scheduler + backend), not on the game thread.

**`isPlaying()`** combines **`AudioEngine::isMusicPlaying()`** / **`isMusicPaused()`** (atomics owned by **`ApuCore`**) with a short **in-flight** window after **`play()`** so the game thread does not flicker to **false** before **`MUSIC_PLAY`** is consumed. While **paused**, **`isPlaying()`** is **false**. If the **SPSC** queue drops a command, local flags can disagree with **`ApuCore`** — avoid saturating the queue.

### Public API

- **`MusicPlayer(AudioEngine& engine)`**
- **`void play(const MusicTrack& track)`** — starts from the beginning; packs **main + up to 3 sub-tracks** into one **`MUSIC_PLAY`** command.
- **`void stop()`** / **`void pause()`** / **`void resume()`**
- **`bool isPlaying() const`**
- **`void setTempoFactor(float factor)`** / **`float getTempoFactor() const`** — **`MUSIC_SET_TEMPO`** (clamped **≥ 0.1** in implementation).
- **`void setBPM(float bpm)`** / **`float getBPM() const`** — **`MUSIC_SET_BPM`**; engine clamps to **[30, 300]**; default **150** BPM with **4 ticks per beat** inside **`ApuCore`**.
- **`size_t getActiveTrackCount() const`** — after **`play()`**, returns **1–4** according to which of **`secondVoice` / `thirdVoice` / `percussion`** were non-null; **0** if not **`playing`** or no **`currentTrack`**.

### Typical usage (single track)

```cpp
using namespace pixelroot32::audio;

static const MusicNote MELODY[] = {
    makeNote(INSTR_PULSE_LEAD, Note::C, 0.20f),
    makeNote(INSTR_PULSE_LEAD, Note::E, 0.20f),
    makeNote(INSTR_PULSE_LEAD, Note::G, 0.25f),
    makeRest(0.10f),
};

static const MusicTrack GAME_MUSIC = {
    MELODY,
    sizeof(MELODY) / sizeof(MusicNote),
    true,
    WaveType::PULSE,
    0.5f,
};

void MyScene::init(pr32::core::Engine& engine) {
    engine.getMusicPlayer().play(GAME_MUSIC);
}
```

### Multi-track usage

```cpp
static const MusicNote BASS[] = {
    makeNote(INSTR_TRIANGLE_BASS, Note::C, 2, 0.5f),
    makeNote(INSTR_TRIANGLE_BASS, Note::G, 2, 0.5f),
};
static const MusicTrack BASS_TRACK = {
    BASS, sizeof(BASS) / sizeof(MusicNote), true, WaveType::TRIANGLE, 0.5f,
};

static const MusicNote DRUMS[] = {
    makeNote(INSTR_KICK, Note::C, 0.12f),
    makeRest(0.12f),
    makeNote(INSTR_SNARE, Note::C, 0.15f),
    makeRest(0.13f),
};
static const MusicTrack DRUM_TRACK = {
    DRUMS, sizeof(DRUMS) / sizeof(MusicNote), true, WaveType::NOISE, 0.0f,
};

static const MusicNote LEAD[] = {
    makeNote(INSTR_PULSE_LEAD, Note::C, 4, 0.25f),
    makeNote(INSTR_PULSE_LEAD, Note::E, 4, 0.25f),
};
static const MusicTrack FULL = {
    LEAD,
    sizeof(LEAD) / sizeof(MusicNote),
    true,
    WaveType::PULSE,
    0.5f,
    &BASS_TRACK,
    nullptr,
    &DRUM_TRACK,
};

// musicPlayer.play(FULL);
// size_t layers = musicPlayer.getActiveTrackCount(); // 3
```

On **`DRUMS`**, **`Note::C`** is only a placeholder; **`Note::Rest`** is equally valid for percussion presets—the noise clock comes from **`instrumentToFrequency`** and the preset.

For a full sample project, see **[`examples/music_demo`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/music_demo)**.

---
