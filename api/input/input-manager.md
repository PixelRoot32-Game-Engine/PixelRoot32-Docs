# InputManager & InputConfig

> **Source:** Ported from the [PixelRoot32 Game Engine](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine) repository. Cross-links were adjusted for this site.

## Input Module Overview

Handles **physical buttons** / **keyboard** via `InputManager`, and **touch screens** via `TouchManager` and optional `ActorTouchController`.

---


## InputManager

**Include:** `input/InputManager.h`

**Inherits:** None

Handles input polling, debouncing, and state tracking for physical buttons (ESP32) or keyboard (Native/SDL2).

### Public Methods

- **`InputManager(const InputConfig& config)`**
    Constructs the InputManager with a specific configuration.

- **`void init()`**
    Initializes the input pins.

- **`void update(unsigned long dt)`** (ESP32)
    Updates input state by polling hardware pins.

- **`void update(unsigned long dt, const uint8_t* keyboardState)`** (Native/SDL2)
    Updates input state based on SDL keyboard state.

- **`bool isButtonPressed(uint8_t buttonIndex) const`**
    Returns true if button was just pressed this frame (UP → DOWN).

- **`bool isButtonReleased(uint8_t buttonIndex) const`**
    Returns true if button was just released this frame (DOWN → UP).

- **`bool isButtonDown(uint8_t buttonIndex) const`**
    Returns true if button is currently held down.

- **`bool isButtonClicked(uint8_t buttonIndex) const`**
    Returns true if button was clicked (pressed and released in same frame).

---


## InputConfig

**Inherits:** None

Configuration structure for `InputManager`. Defines the mapping between logical inputs and physical pins (ESP32) or keyboard keys (Native/SDL2).

- **`std::vector<int> inputPins`**: (ESP32) List of GPIO pins.
- **`std::vector<uint8_t> buttonNames`**: (Native) List of scancodes/keys.
- **`int count`**: Total number of configured inputs.

### Constructor

- **`InputConfig(int count, ...)`**
    Variadic constructor to easily list pins/keys.

### Example

```cpp
// 3 inputs: Left, Right, Jump
InputConfig input(3, 12, 14, 27);
```

---
