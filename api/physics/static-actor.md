# StaticActor

> **Source:** Ported from the [PixelRoot32 Game Engine](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine) repository. Cross-links were adjusted for this site.

## StaticActor

**Inherits:** [PhysicsActor](#physicsactor)

An immovable body that other objects can collide with. Ideal for floors, walls, and level geometry. Static bodies are placed in the **static layer** of the spatial grid (rebuilt only when entities are added or removed), reducing per-frame cost in levels with many tiles.

### Constructors

- **`StaticActor(Scalar x, Scalar y, int w, int h)`**
    Constructs a new StaticActor.

- **`StaticActor(Vector2 position, int w, int h)`**
    Constructs a new StaticActor using a position vector.

**Example:**

```cpp
auto floor = std::make_unique<StaticActor>(0, 230, 240, 10);
floor->setCollisionLayer(Layers::kWall);
scene->addEntity(floor.get());
```

---
