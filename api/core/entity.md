# Entity

> **Source:** Ported from the [PixelRoot32 Game Engine](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine) repository. Cross-links were adjusted for this site.

## Entity

**Inherits:** None

Abstract base class for all game objects. Entities are the fundamental building blocks of the scene. They have a position, size, and lifecycle methods (`update`, `draw`).

### Properties

- **`Scalar x, y`**: Position in world space.
- **`int width, height`**: Dimensions of the entity.
- **`bool isVisible`**: If false, the entity is skipped during rendering.
- **`bool isEnabled`**: If false, the entity is skipped during updates.
- **`unsigned char renderLayer`**: Logical render layer for this entity (0 = background, 1 = gameplay, 2 = UI).

### Public Methods

- **`Entity(Scalar x, Scalar y, int w, int h, EntityType t)`**
    Constructs a new Entity.

- **`void setVisible(bool v)`**
    Sets the visibility of the entity.

- **`void setEnabled(bool e)`**
    Sets the enabled state of the entity.

- **`unsigned char getRenderLayer() const`**
    Returns the current render layer.

- **`void setRenderLayer(unsigned char layer)`**
    Sets the logical render layer for this entity. The value is clamped to the range `[0, MAX_LAYERS - 1]`.

- **`virtual void update(unsigned long deltaTime)`**
    Updates the entity's logic. Must be overridden by subclasses.

- **`virtual void draw(Renderer& renderer)`**
    Renders the entity. Must be overridden by subclasses.

### Modular Compilation Notes

The Entity class is always available. However, specialized subclasses may be affected by modular compilation flags:

- **UI Elements** (UIButton, UILabel, etc.): Only available if `PIXELROOT32_ENABLE_UI_SYSTEM=1`
- **Physics Actors** (PhysicsActor, RigidActor, etc.): Only available if `PIXELROOT32_ENABLE_PHYSICS=1`
- **Particle Systems**: Only available if `PIXELROOT32_ENABLE_PARTICLES=1`

---
