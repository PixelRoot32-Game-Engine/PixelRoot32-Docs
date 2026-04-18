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
- **`const InstrumentPreset* preset`**: optional; **`nullptr`** uses the parent track’s defaults / legacy path. When set, **`makeNote`** stores the preset pointer on each note.

### `MusicTrack`

- **`const MusicNote* notes`**, **`size_t count`**, **`bool loop`**.
- **`WaveType channelType`**, **`float duty`**: waveform for that layer (**`NOISE`** + **`duty == 0`** for drum tracks).
- **`const MusicTrack* secondVoice`**, **`thirdVoice`**, **`percussion`**: optional pointers to **other** `MusicTrack` instances (static data). **`nullptr`** disables that layer.

### `InstrumentPreset`

- **`float baseVolume`**, **`float duty`**, **`uint8_t defaultOctave`**.
- **`float defaultDuration`**: if **> 0**, fixed hit length for percussion (**0** = use **`MusicNote::duration`**).
- **`uint8_t noisePeriod`**: for **`NOISE`**, LFSR period (**0** = derive from frequency; **> 0** = explicit period).

**Percussion** presets use **`duty == 0`** (noise path in **`instrumentToFrequency`** / sequencer).

#### Built-in presets

| Preset | Role |
|--------|------|
| **`INSTR_PULSE_LEAD`** | Lead pulse |
| **`INSTR_PULSE_HARMONY`** | Thinner / higher pulse |
| **`INSTR_TRIANGLE_BASS`** | Triangle bass |
| **`INSTR_KICK`**, **`INSTR_SNARE`**, **`INSTR_HIHAT`** | Short noise hits with tuned **`defaultDuration`** / **`noisePeriod`** |

#### Helpers

- **`MusicNote makeNote(const InstrumentPreset& preset, Note note, float duration)`**
- **`MusicNote makeNote(const InstrumentPreset& preset, Note note, uint8_t octave, float duration)`**
- **`MusicNote makeRest(float duration)`**
- **`float instrumentToFrequency(const InstrumentPreset& preset, Note, uint8_t)`** — melodic vs percussion routing.

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

For a full sample project, see **[`examples/music_demo`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/music_demo)**.

---
