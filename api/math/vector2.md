# Vector2

> **Source:** Ported from the [PixelRoot32 Game Engine](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine) repository. Cross-links were adjusted for this site.

## Vector2

**Namespace:** `pixelroot32::math`

A 2D vector structure composed of two `Scalar` components.

### Members

- **`Scalar x`**
- **`Scalar y`**

### Methods

- **`Vector2(Scalar x, Scalar y)`**
    Constructor.

- **`Scalar lengthSquared() const`**
    Returns the squared magnitude of the vector. **Preferred over `length()` for comparisons.**

- **`Scalar length() const`**
    Returns the magnitude of the vector.

- **`Vector2 normalized() const`**
    Returns a normalized (unit length) version of the vector.

- **`Scalar dot(const Vector2& other) const`**
    Returns the dot product with another vector.

- **`Scalar cross(const Vector2& other) const`**
    Returns the cross product with another vector (2D analog).

- **`Scalar angle() const`**
    Returns the angle of the vector in radians.

- **`Scalar angle_to(const Vector2& to) const`**
    Returns the angle to another vector in radians.

- **`Scalar angle_to_point(const Vector2& to) const`**
    Returns the angle from this point to another point.

- **`Vector2 direction_to(const Vector2& to) const`**
    Returns the normalized direction vector pointing to the target.

- **`Scalar distance_to(const Vector2& to) const`**
    Returns the distance to another point.

- **`Scalar distance_squared_to(const Vector2& to) const`**
    Returns the squared distance to another point.

- **`Vector2 limit_length(Scalar max_len) const`**
    Returns the vector with its length limited to `max_len`.

- **`Vector2 clamp(Vector2 min, Vector2 max) const`**
    Returns the vector clamped between min and max vectors.

- **`Vector2 lerp(const Vector2& to, Scalar weight) const`**
    Linear interpolation between this vector and `to`.

- **`Vector2 rotated(Scalar phi) const`**
    Returns the vector rotated by `phi` radians.

- **`Vector2 move_toward(const Vector2& to, Scalar delta) const`**
    Moves the vector toward `to` by a maximum of `delta` distance.

- **`Vector2 slide(const Vector2& n) const`**
    Returns the component of the vector along the sliding plane defined by normal `n`.

- **`Vector2 reflect(const Vector2& n) const`**
    Returns the vector reflected across the plane defined by normal `n`.

- **`Vector2 project(const Vector2& b) const`**
    Returns the projection of this vector onto vector `b`.

- **`Vector2 abs() const`**
    Returns a new vector with absolute values of components.

- **`Vector2 sign() const`**
    Returns a new vector with sign of components.

- **`bool is_normalized() const`**
    Returns true if the vector is normalized.

- **`bool is_zero_approx() const`**
    Returns true if the vector is approximately zero.

- **`bool is_equal_approx(const Vector2& other) const`**
    Returns true if the vector is approximately equal to `other`.

---
