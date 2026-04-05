# Engine

> **Source:** Ported from the [PixelRoot32 Game Engine](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine) repository. Cross-links were adjusted for this site.

## Engine

**Inherits:** None

The main engine class that manages the game loop and core subsystems. `Engine` acts as the central hub, initializing and managing the Renderer, InputManager, and SceneManager. It runs the main game loop, handling timing (delta time), updating the current scene, and rendering frames.

### Public Methods

- **`Engine(DisplayConfig&& displayConfig, const InputConfig& inputConfig, const AudioConfig& audioConfig)`**
    Constructs the engine with custom display, input and audio configurations.

- **`Engine(DisplayConfig&& displayConfig, const InputConfig& inputConfig)`**
    Constructs the engine with custom display and input configurations.

- **`Engine(DisplayConfig&& displayConfig)`**
    Constructs the engine with custom display configuration and default input settings.

- **`void init()`**
    Initializes the engine subsystems. Must be called before `run()`.

- **`void run()`**
    Starts the main game loop. This method contains the infinite loop that calls `update()` and `draw()` repeatedly.

- **`unsigned long getDeltaTime() const`**
    Returns the time elapsed since the last frame in milliseconds.

- **`unsigned long getMillis() const`**
    Returns the number of milliseconds since the engine started.

- **`void setScene(Scene* newScene)`**
    Sets the current active scene.

- **`std::optional<Scene*> getCurrentScene() const`**
    Retrieves the currently active scene, or std::nullopt if no scene is active.

- **`Renderer& getRenderer()`**
    Provides access to the Renderer subsystem.

- **`void setRenderer(pixelroot32::graphics::Renderer&& newRenderer)`**
    Replaces the current renderer instance.

- **`InputManager& getInputManager()`**
    Provides access to the InputManager subsystem.

- **`TouchEventDispatcher& getTouchDispatcher()`**
    Provides access to the touch system for injecting touch points. Use this on ESP32 to connect TouchManager with Engine's touch processing pipeline.
  - **Note**: Only available if `PIXELROOT32_ENABLE_TOUCH=1`

- **`bool hasTouchEvents() const`**
    Returns true if there are pending touch events in the queue.
  - **Note**: Only available if `PIXELROOT32_ENABLE_TOUCH=1`

- **`void setTouchManager(pixelroot32::input::TouchManager* touchManager)`**
    Registers a TouchManager instance for automatic touch processing on ESP32. When set, Engine automatically:
    - Polls `touchManager.getTouchPoints()` each frame
    - Detects touch releases (when count goes from >0 to 0)
    - Processes touch events through the internal TouchEventDispatcher
    - Sends gesture events to the current scene via `Scene::processTouchEvents()`

    Usage (ESP32):

    ```cpp
    touchManager.init();
    engine.setTouchManager(&touchManager);  // 1 línea
    
    void loop() {
        touchManager.update(frameDt);
        engine.run();  // Engine maneja todo automáticamente
    }
    ```

  - **Note**: Only available if `PIXELROOT32_ENABLE_TOUCH=1`

- **`AudioEngine& getAudioEngine()`**
    Provides access to the AudioEngine subsystem.
  - **Note**: Only available if `PIXELROOT32_ENABLE_AUDIO=1`

- **`MusicPlayer& getMusicPlayer()`**
    Provides access to the MusicPlayer subsystem.
  - **Note**: Only available if `PIXELROOT32_ENABLE_AUDIO=1`

- **`const PlatformCapabilities& getPlatformCapabilities() const`**
    Returns the detected hardware capabilities for the current platform.

---


## PlatformCapabilities (Struct)

**Namespace:** `pixelroot32::platforms`

A structure that holds detected hardware capabilities, used to optimize task pinning and threading.

- **`bool hasDualCore`**: True if the hardware has more than one CPU core.
- **`int coreCount`**: Total number of CPU cores detected.
- **`int audioCoreId`**: Recommended CPU core for audio tasks.
- **`int mainCoreId`**: Recommended CPU core for the main game loop.
- **`int audioPriority`**: Recommended priority for audio tasks.

### Static Methods

- **`static PlatformCapabilities detect()`**: Automatically detects hardware capabilities based on the platform and configuration. It respects the defaults defined in `platforms/PlatformDefaults.h` and any compile-time overrides.

---


## DisplayConfig (Struct)

Configuration settings for display initialization and scaling.

- **`DisplayType type`**: Type of display (ST7789, ST7735, OLED_SSD1306, OLED_SH1106, NONE, CUSTOM).
- **`int rotation`**: Display rotation (0-3 or degrees).
- **`uint16_t physicalWidth`**: Actual hardware width.
- **`uint16_t physicalHeight`**: Actual hardware height.
- **`uint16_t logicalWidth`**: Virtual rendering width.
- **`uint16_t logicalHeight`**: Virtual rendering height.
- **`int xOffset`**: X coordinate offset for hardware alignment.
- **`int yOffset`**: Y coordinate offset for hardware alignment.

### Pin Configuration (Optional)

- **`uint8_t clockPin`**: SPI SCK / I2C SCL.
- **`uint8_t dataPin`**: SPI MOSI / I2C SDA.
- **`uint8_t csPin`**: SPI CS (Chip Select).
- **`uint8_t dcPin`**: SPI DC (Data/Command).
- **`uint8_t resetPin`**: Reset pin.
- **`bool useHardwareI2C`**: If true, uses hardware I2C peripheral (default true).

---


## Optional: Debug Statistics Overlay (build flag)

When the engine is built with the preprocessor define **`PIXELROOT32_ENABLE_DEBUG_OVERLAY`**, the engine draws a technical overlay with real-time metrics.

- **Metrics Included**:
  - **FPS**: Frames per second (green).
  - **RAM**: Memory used in KB (cyan). ESP32 specific.
  - **CPU**: Estimated processor load percentage based on frame processing time (yellow).
- **Behavior**: The metrics are drawn in the top-right area of the screen, fixed and independent of the camera.
- **Performance**: Values are recalculated and formatted only every **16 frames** (`DEBUG_UPDATE_INTERVAL`); the cached strings are drawn every frame. This ensures minimal overhead while providing useful development data.
- **Usage**: Add to your build flags, e.g. in `platformio.ini`:  
  `build_flags = -D PIXELROOT32_ENABLE_DEBUG_OVERLAY`  
  This flag is also available in `EngineConfig.h`.
- **Internal**: Implemented by the private method `Engine::drawDebugOverlay(Renderer& r)`.

---
