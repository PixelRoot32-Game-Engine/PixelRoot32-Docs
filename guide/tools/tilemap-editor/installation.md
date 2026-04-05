# Tilemap Editor Installation

The **PixelRoot32 Tilemap Editor** can be run from **Python source** or from **pre-built** downloads (see [Releases](https://github.com/Gperez88/PixelRoot32-Tilemap-Editor/releases) on the editor repository).

::: tip Premium module

This editor is part of the **Tool Suite**. Use the official site for licenses and support: [pixelroot32.com](https://pixelroot32.com).

:::

## Requirements (source)

- **Python 3.13+** (or as specified in the repository README if it changes).
- OS: **Windows** is the primary tested environment; check **Releases** for Linux/macOS artifacts when available.

## Install from source

### Clone

```powershell
git clone https://github.com/Gperez88/PixelRoot32-Tilemap-Editor.git
cd PixelRoot32-Tilemap-Editor
```

### Dependencies

```powershell
pip install ttkbootstrap pillow jinja2
```

(Use `pip install -r requirements.txt` if the repo provides one.)

### Run

```powershell
python main.py
```

## Pre-built binaries

### Windows

Typical flow from **Releases**:

1. Download the latest **`PixelRoot32-Editor-win64.zip`** (or the current asset name).
2. Extract and run **`PixelRoot32-Editor.exe`**.

No Python install is required for the packaged build.

### Linux / macOS

If the project publishes **AppImage**, **.deb**, **.dmg**, or **.app** builds, use the asset matching your OS and follow the release notes (permissions, Gatekeeper, etc.). Otherwise use **source** install above.

## Build your own executable (PyInstaller)

```powershell
pip install pyinstaller
pyinstaller pixelroot32_editor.spec
```

Output appears under `dist/` (details in the upstream repo).

## Next steps

- [Overview](/guide/tools/tilemap-editor/overview)
- [Usage guide](/guide/tools/tilemap-editor/usage-guide)

## See also

- [Tools overview](/guide/tools/)
