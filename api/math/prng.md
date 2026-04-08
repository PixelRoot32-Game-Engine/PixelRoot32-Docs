# PRNG (Random Number Generation)

> **Source:** Ported from the [PixelRoot32 Game Engine](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine) repository. Cross-links were adjusted for this site.

## Random Number Generation (PRNG)

The `math` namespace provides a deterministic pseudo-random number generator (PRNG) based on the Xorshift32 algorithm.

### PRNG System Overview

The PRNG uses the **Xorshift32 algorithm**, a lightweight, high-quality pseudo-random number generator that:

- Uses only bitwise operations (XOR, shifts) - no multiplication or division
- Produces deterministic sequences based on seed value
- Has excellent statistical properties for game development
- Is compact and efficient for embedded systems (ESP32)

**Note:** This PRNG is suitable for gameplay mechanics (procedural generation, dice rolls, random events) but is **not cryptographically secure**.

---

### Thread Safety and Concurrency

**Global PRNG functions are NOT thread-safe.** The global PRNG state (`set_seed`, `rand01`, `rand_int`, etc.) should not be accessed concurrently from multiple threads or ISRs without external synchronization.

**For concurrent or multi-threaded scenarios, use the `Random` struct:**

```cpp
// Each thread has its own Random instance
thread_local Random threadRNG(generate_unique_seed());

// Safe concurrent access - no locks needed
void threadWorker() {
    int value = threadRNG.rand_int(1, 100);
}
```

**Recommendation:**

- Single-threaded games: Use global functions for simplicity
- Multi-threaded scenarios: Create `Random` instances per thread/context
- Per-entity randomness: Give each entity its own `Random` instance

---

### Implementation Quality

The PRNG implementation includes several quality improvements:

- **Bias-free integer generation**: Uses rejection sampling to ensure uniform distribution for any range
- **Fixed16 optimization**: On platforms without FPU, `rand01()` uses bit-shifting (no float operations)
- **Unified core algorithm**: Single `xorshift32()` function ensures consistent behavior
- **State validation**: Automatically prevents PRNG from entering invalid zero state

---

### Global PRNG Functions

- **`void set_seed(uint32_t seed)`**
    Initializes the PRNG with a specific seed. If seed is 0, uses fallback constant `0xDEADBEEF`.

    ```cpp
    // Initialize with specific seed for reproducible gameplay
    set_seed(12345);
    
    // Reset with 0 (will use fallback seed)
    set_seed(0);
    ```

- **`Scalar rand01()`**
    Returns random Scalar in range [0, 1]. Works with both float and Fixed16 Scalars.

    ```cpp
    Scalar roll = rand01();  // 0.0 to 1.0
    ```

- **`Scalar rand_range(Scalar min, Scalar max)`**
    Returns random Scalar in inclusive range [min, max].

    ```cpp
    // Random position between 10 and 100
    Scalar posX = rand_range(toScalar(10), toScalar(100));
    
    // Random damage between 5 and 15
    Scalar damage = rand_range(toScalar(5), toScalar(15));
    ```

- **`int32_t rand_int(int32_t min, int32_t max)`**
    Returns random integer in inclusive range [min, max].

    ```cpp
    // Roll a 6-sided die
    int roll = rand_int(1, 6);
    
    // Random array index
    int index = rand_int(0, arraySize - 1);
    ```

- **`bool rand_chance(Scalar p)`**
    Returns true with probability p (0.0 to 1.0).

    ```cpp
    // 30% chance to spawn power-up
    if (rand_chance(toScalar(0.3f))) {
        spawnPowerUp();
    }
    
    // Guaranteed event
    if (rand_chance(toScalar(1.0f))) { /* always true */ }
    ```

- **`Scalar rand_sign()`**
    Returns -1 or 1 as Scalar (50% probability each).

    ```cpp
    // Random direction
    Scalar direction = rand_sign();  // -1 or 1
    velocity.x = speed * direction;
    ```

---

### Instance-Based RNG: Random Struct

For scenarios requiring multiple independent random sequences (e.g., per-entity RNG, separate generators for different systems):

```cpp
// Create independent RNG instances
Random enemyRNG(12345);    // For enemy spawns
Random lootRNG(67890);     // For loot drops
Random visualRNG(11111);   // For visual effects

// Use independently - each has its own state
Scalar enemyX = enemyRNG.rand_range(toScalar(0), toScalar(100));
int lootTier = lootRNG.rand_int(1, 5);
```

The `Random` struct provides the same methods as global functions:

- `next()` - Generate next uint32_t value
- `rand01()` - Random Scalar in [0, 1]
- `rand_range(min, max)` - Random Scalar in range
- `rand_int(min, max)` - Random integer in range
- `rand_chance(p)` - Boolean with probability p
- `rand_sign()` - -1 or 1

---

### Common Usage Patterns

**Pattern 1: Seeded Procedural Generation**

```cpp
// Same seed always produces same level
set_seed(levelSeed);
for (int i = 0; i < 100; i++) {
    Scalar x = rand_range(toScalar(0), worldWidth);
    Scalar y = rand_range(toScalar(0), worldHeight);
    spawnTree(x, y);
}
```

**Pattern 2: Deterministic Dice Rolls**

```cpp
set_seed(turnNumber);  // Reproducible combat
int attackRoll = rand_int(1, 20);
int damageRoll = rand_int(1, 8);
```

**Pattern 3: Random Spawning with Probability**

```cpp
void update() {
    // 1% chance per frame to spawn enemy
    if (rand_chance(toScalar(0.01f))) {
        spawnEnemy();
    }
}
```

**Pattern 4: Shuffle Array (Fisher-Yates)**

```cpp
template<typename T>
void shuffleArray(T* array, int count) {
    for (int i = count - 1; i > 0; i--) {
        int j = rand_int(0, i);
        swap(array[i], array[j]);
    }
}
```

---

### Math Constants

- **`kPi`** - π (3.14159265)
- **`kDegToRad`** - Degrees to radians conversion factor
- **`kRadToDeg`** - Radians to degrees conversion factor
- **`kEpsilon`** - Small value for approximate equality checks

---
