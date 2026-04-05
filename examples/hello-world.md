# Hello World (`hello_world`)

This page tracks the **`examples/hello_world/`** sample in the engine repository — a **minimal** boot check: `UILabel`, button polling via **`InputManager`**, and a **background color** cycle. Display is **128×128** (see that folder’s `platformio.ini`).

::: warning Not the “full UI demo” tutorial
If you saw a longer walkthrough with `UIButton`, `UIVerticalLayout`, audio, and touch, that was a **composite tutorial** and does **not** match this repo folder. For rich UI patterns see [UI system](/guide/ui-system) and [`tic_tac_toe`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/tic_tac_toe).
:::

## Source layout (repository)

- [`src/main.cpp`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/examples/hello_world/src/main.cpp) — includes the platform header (`native` / `esp32_dev`).
- [`src/HelloWorldScene.h`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/examples/hello_world/src/HelloWorldScene.h) / [`.cpp`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/examples/hello_world/src/HelloWorldScene.cpp) — scene logic and labels.

Authoritative build flags, pinout, and **`pio run`** commands are in **[`examples/hello_world/README.md`](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/blob/main/examples/hello_world/README.md)** on GitHub.

## APIs to read next

- [Engine](/api/core/engine), [Scene](/api/core/scene)
- [Renderer](/api/graphics/renderer), [InputManager](/api/input/input-manager)
- UI: [UILabel](/api/modules/ui) (via UI module docs)

## See also

- [Samples index](./demos)
- [Entities tutorial](./basic-usage) — patterns with `Entity` (separate from this folder)
