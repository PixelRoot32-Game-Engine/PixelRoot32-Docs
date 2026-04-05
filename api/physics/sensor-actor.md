# SensorActor

> **Source:** Ported from the [PixelRoot32 Game Engine](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine) repository. Cross-links were adjusted for this site.

## SensorActor

**Inherits:** [StaticActor](#staticactor)

A static body that acts as a **trigger**: it generates `onCollision` callbacks but does not produce any physical response (no impulse, no penetration correction). Use for collectibles, checkpoints, damage zones, or area triggers.

**Include:** `physics/SensorActor.h`

**Constructors:** Same as `StaticActor`; internally calls `setSensor(true)`.

```cpp
SensorActor coin(x, y, 16, 16);
coin.setCollisionLayer(Layers::kCollectible);
scene->addEntity(&coin);
// In player's onCollision: if (other->isSensor()) { collectCoin(other); }
```

---
