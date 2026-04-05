# RigidActor

> **Source:** Ported from the [PixelRoot32 Game Engine](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine) repository. Cross-links were adjusted for this site.

## RigidActor

**Inherits:** [PhysicsActor](#physicsactor)

A body fully simulated by the physics engine. It is affected by gravity, forces, and collisions with other bodies. Ideal for debris, boxes, and physical props.

### Constructors

- **`RigidActor(Scalar x, Scalar y, int w, int h)`**
    Constructs a new RigidActor.

- **`RigidActor(Vector2 position, int w, int h)`**
    Constructs a new RigidActor using a position vector.

### Properties

- **`bool bounce`** (property accessor): Whether the object should use restitution for bounces. Supports `actor->bounce = true` (property syntax) or explicit `actor->setBounce(true)` / `actor->isBounce()` methods. Internally stored in packed flags.

**Example:**

```cpp
auto box = std::make_unique<RigidActor>(100, 0, 16, 16);
box->setCollisionLayer(Layers::kProps);
box->bounce = true; // Make it bouncy
scene->addEntity(box.get());
```

---
