# KinematicActor

> **Source:** Ported from the [PixelRoot32 Game Engine](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine) repository. Cross-links were adjusted for this site.

## KinematicActor

**Inherits:** [PhysicsActor](#physicsactor)

A body that is moved manually via code but still interacts with the physics world (stops at walls, pushes objects). Ideal for players and moving platforms.

### Constructors

- **`KinematicActor(Scalar x, Scalar y, int w, int h)`**
    Constructs a new KinematicActor.

- **`KinematicActor(Vector2 position, int w, int h)`**
    Constructs a new KinematicActor using a position vector.

### Public Methods

- **`bool moveAndCollide(Vector2 relativeMove)`**
    Moves the actor by `relativeMove`. If a collision occurs, it stops at the point of contact and returns `true`.
- **`Vector2 moveAndSlide(Vector2 velocity)`**
    Moves the actor, sliding along surfaces if it hits a wall or floor. Returns the remaining velocity.

- **`bool is_on_ceiling() const`**
    Returns true if the body collided with the ceiling during the last `moveAndSlide` call.

- **`bool is_on_floor() const`**
    Returns true if the body collided with the floor during the last `moveAndSlide` call.

- **`bool is_on_wall() const`**
    Returns true if the body collided with a wall during the last `moveAndSlide` call.

**Example:**

```cpp
void Player::update(unsigned long dt) {
    Vector2 motion(0, 0);
    if (input.isButtonDown(0)) motion.x += 100 * dt / 1000.0f;
    
    // Automatic sliding against walls
    moveAndSlide(motion);
}
```

---
