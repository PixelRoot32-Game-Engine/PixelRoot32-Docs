# Scene

> **Source:** Ported from the [PixelRoot32 Game Engine](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine) repository. Cross-links were adjusted for this site.

## Scene

**Inherits:** None

Represents a game level or screen containing entities. A Scene manages a collection of Entities and a CollisionSystem. It is responsible for updating and drawing all entities it contains.

### Public Methods

- **`virtual void init()`**
    Called when the scene is initialized or entered.

- **`virtual void update(unsigned long deltaTime)`**
    Updates all entities in the scene and runs the physics pipeline. Touch **`UITouchElement`** instances are updated here only when they are registered as **entities** (e.g. via a **`UILayout`** with **`addEntity`**); **`UIManager::update`** is a no-op.

- **`virtual void draw(Renderer& renderer)`**
    Draws all visible entities in the scene, iterating them by logical render layers (0 = background, 1 = gameplay, 2 = UI). Touch widgets draw through this path as entities; **`UIManager::draw`** is a no-op.

- **`virtual void processTouchEvents(TouchEvent* events, uint8_t count)`**
    Runs the central touch pipeline for one frame: if `PIXELROOT32_ENABLE_UI_SYSTEM`, **`UIManager::processEvents`** runs first and may mark events consumed; then **`onUnconsumedTouchEvent`** is called for each unconsumed event. Override in a subclass only if you need preprocessing before the base implementation; otherwise override **`onUnconsumedTouchEvent`** for gameplay.

- **`virtual void onUnconsumedTouchEvent(const TouchEvent& event)`**
    Hook for touch not handled by UI. Default is no-op. Typical use: forward to **`ActorTouchController::handleTouch`** or custom gestures.

- **`void addEntity(Entity* entity)`**
    Adds an entity to the scene.
    > **Note:** The scene does **not** take ownership of the entity. You must ensure the entity remains valid as long as it is in the scene (typically by holding it in a `std::unique_ptr` within your Scene class).

- **`void removeEntity(Entity* entity)`**
    Removes a specific entity from the scene (and from the collision system when physics is enabled).

- **`void clearEntities()`**
    Removes all entities from the scene. Does not delete the entity objects.

### Overriding scene limits (MAX_LAYERS / MAX_ENTITIES)

The engine defines default limits in `platforms/EngineConfig.h`: `MAX_LAYERS` (default 3) and `MAX_ENTITIES` (default 32). These are guarded with `#ifndef`, so you can override them from your project without modifying the engine.

> **Note:** The default of 3 for `MAX_LAYERS` is due to ESP32 platform constraints (memory and draw-loop cost). On native/PC you can safely use a higher value; on ESP32, increasing it may affect performance or memory.

**Compiler flags (recommended)**

In your project (e.g. in `platformio.ini`), add the defines to `build_flags` for the environment you use:

```ini
build_flags =
    -DMAX_LAYERS=5
    -DMAX_ENTITIES=64
```

The compiler defines `MAX_LAYERS` and `MAX_ENTITIES` before processing any `.cpp` file. Because `Scene.h` uses `#ifndef MAX_LAYERS` / `#ifndef MAX_ENTITIES`, it will not redefine them and your values will be used. This affects how many render layers are drawn (see `Scene::draw`) and, on Arduino, the capacity of the scene entity queue when constructed with `MAX_ENTITIES`.

---
