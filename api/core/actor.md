# Actor (physics)

> **Source:** Ported from the [PixelRoot32 Game Engine](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine) repository. Cross-links were adjusted for this site.

## Actor

**Include:** `core/Actor.h`

**Inherits:** [Entity](/api/core/engine.md#entity)

The base class for all objects capable of collision. Actors extend Entity with collision layers, masks, and shape definitions. Note: You should typically use a specialized subclass like `RigidActor` or `KinematicActor` instead of this base class.

### Constants

- **`enum CollisionShape`**
  - `AABB`: Axis-aligned bounding box (Rectangle).
  - `CIRCLE`: Circular collision body.

### Properties

- **`uint16_t entityId`**: Unique id assigned by `CollisionSystem::addEntity` (used for pair deduplication). `0` = unregistered.
- **`int queryId`**: Used internally by the spatial grid for deduplication in `getPotentialColliders`.
- **`CollisionLayer layer`**: Bitmask representing the layers this actor belongs to.
- **`CollisionLayer mask`**: Bitmask representing the layers this actor scans for collisions.

### Public Methods

- **`Actor(Scalar x, Scalar y, int w, int h)`**
    Constructs a new Actor.

- **`void setCollisionLayer(CollisionLayer l)`**
    Sets the collision layer this actor belongs to.

- **`void setCollisionMask(CollisionLayer m)`**
    Sets the collision layers this actor interacts with.

- **`bool isInLayer(uint16_t targetLayer) const`**
    Checks if the Actor belongs to a specific collision layer.

- **`virtual Rect getHitBox()`**
    Returns the bounding rectangle for AABB detection or the bounding box of the circle.

- **`virtual void onCollision(Actor* other)`**
    Callback invoked when a collision is detected. **Note:** All collision responses (velocity/position changes) are handled by the `CollisionSystem`. This method is for gameplay notifications only.

---
