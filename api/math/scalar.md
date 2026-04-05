# Scalar & math helpers

> **Source:** Ported from the [PixelRoot32 Game Engine](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine) repository. Cross-links were adjusted for this site.

## Scalar Type

**Namespace:** `pixelroot32::math`

`Scalar` is the fundamental numeric type used throughout the engine for physics, positioning, and logic.

- **On FPU platforms (ESP32, S3):** `Scalar` is an alias for `float`.
- **On non-FPU platforms (C3, S2, C6):** `Scalar` is an alias for `Fixed16`.

### Fixed16 (16.16 Fixed Point)

On platforms without a Hardware Floating Point Unit (FPU), the engine uses `Fixed16` for all calculations.

- **Storage**: 32-bit signed integer.
- **Precision**: 16 bits for the integer part, 16 bits for the fractional part (approx. 0.000015 resolution).
- **Literal**: Use the `_fp` suffix for literals on non-FPU platforms for compile-time conversion.
  *Example:* `Scalar gravity = 9.8_fp;`

---


## Helper Functions

- **`Scalar toScalar(float value)`**
    Converts a floating-point literal or variable to `Scalar`.
    *Usage:* `Scalar speed = toScalar(2.5f);`

- **`Scalar toScalar(int value)`**
    Converts an integer to `Scalar`.

- **`int toInt(Scalar value)`**
    Converts a `Scalar` back to an integer (truncating decimals).

- **`int roundToInt(Scalar value)`**
    Converts a `Scalar` to an integer, rounding to the nearest whole number. Essential for mapping logical positions to pixel coordinates without jitter.

- **`int floorToInt(Scalar value)`**
    Returns the largest integer less than or equal to the scalar value.

- **`int ceilToInt(Scalar value)`**
    Returns the smallest integer greater than or equal to the scalar value.

- **`float toFloat(Scalar value)`**
    Converts a `Scalar` to `float`. **Warning:** Use sparingly on non-FPU platforms.

- **`Scalar abs(Scalar v)`**
    Returns the absolute value.

- **`Scalar sqrt(Scalar v)`**
    Returns the square root. **Warning:** Expensive operation. Prefer squared distances for comparisons.

- **`Scalar min(Scalar a, Scalar b)`**
    Returns the smaller of two values.

- **`Scalar max(Scalar a, Scalar b)`**
    Returns the larger of two values.

- **`Scalar clamp(Scalar v, Scalar minVal, Scalar maxVal)`**
    Clamps a value between a minimum and maximum.

- **`Scalar lerp(Scalar a, Scalar b, Scalar t)`**
    Linearly interpolates between `a` and `b` by `t` (where `t` is 0.0 to 1.0).

- **`Scalar sin(Scalar x)`**
    Returns the sine of the angle `x` (in radians).

- **`Scalar cos(Scalar x)`**
    Returns the cosine of the angle `x` (in radians).

- **`Scalar atan2(Scalar y, Scalar x)`**
    Returns the arc tangent of y/x (in radians).

- **`Scalar sign(Scalar x)`**
    Returns the sign of x (-1, 0, or 1).

- **`bool is_equal_approx(Scalar a, Scalar b)`**
    Returns true if a and b are approximately equal.

- **`bool is_zero_approx(Scalar x)`**
    Returns true if x is approximately zero.

### Constants

- **`Scalar kPi`**
    Value of PI (3.14159...).

- **`Scalar kDegToRad`**
    Conversion factor from degrees to radians.

- **`Scalar kRadToDeg`**
    Conversion factor from radians to degrees.

---
