# PixelRoot32 Tilemap Editor - Complete User Guide

## Table of Contents

1. [Introduction](#1-introduction)
2. [Getting Started](#2-getting-started)
3. [Project Configuration](#3-project-configuration)
4. [Working with Tilesets](#4-working-with-tilesets)
5. [Scene System](#5-scene-system)
6. [Editing Tools](#6-editing-tools)
7. [Tile Animation System](#7-tile-animation-system)
8. [Layer Management](#8-layer-management)
9. [Tile Attributes](#9-tile-attributes)
10. [Tile Flag Rules](#10-tile-flag-rules)
11. [Onion Skinning](#11-onion-skinning)
12. [C++ Export](#12-c-export)
13. [Advanced Configuration](#13-advanced-configuration)
14. [Keyboard Shortcuts](#14-keyboard-shortcuts)
15. [Technical Specifications](#15-technical-specifications)
16. [Multi-Palette Export - Complete Guide](#16-multi-palette-export---complete-guide)

---

## 1. Introduction

The **PixelRoot32 Tilemap Editor** is a specialized tool for creating and editing tile-based maps for the PixelRoot32 engine, specifically optimized for ESP32 hardware constraints.

### Key Features

- **Visual Tilemap Editor** with multi-layer support
- **Tileset Management** with automatic import
- **Scene System** to organize levels/rooms
- **Tile Attributes System** for custom metadata and game logic
- **Tile Flag Rules** with project-level customization
- **C++ Export** with ESP32 optimization
- **Onion Skinning** to align elements between scenes
- **Undo/Redo System** with history compression
- **Binary Format** for large projects (up to 335x smaller)

---

## 2. Getting Started

### 2.1 Starting the Application

```bash
# From the PixelRoot32 Suite launcher
python main.py

# Or run directly
python -m modules.tilemap_editor
```

### 2.2 Welcome Screen

When starting without a project, you will see the welcome screen with two options:

- **Create New Project**: Create a new project from scratch
- **Open Existing Project**: Open an existing project (`.pr32scene` or `.pr32scene.bin`)

---

## 3. Project Configuration

### 3.1 Creating a New Project

**Step 1**: Click on "Create New Project"

**Step 2**: Configure the project parameters:

| Field | Description | Default Value |
|-------|-------------|-------------------|
| **Name** | Project name | "New Scene" |
| **Description** | Optional description | "A new PixelRoot32 project" |
| **Tile Size** | Tile size in pixels | 8 |
| **Map Width** | Map width in tiles | 40 |
| **Map Height** | Map height in tiles | 30 |
| **Orientation** | Screen orientation | Landscape |
| **Screen Width** | Target screen width | 128 |
| **Screen Height** | Target screen height | 128 |

**Step 3**: Click on "Create Project"

**Step 4**: Select an empty folder to save the project

> **Note**: If the folder is not empty, you will be asked if you want to create a subfolder.

### 3.2 "Fit Map to Hardware Limit" Button

This automatic button calculates map dimensions to completely fill the ESP32 screen (320x240 or 240x320 depending on orientation) based on the selected tile size.

**Example**: With 16px tiles in Landscape mode:

- Map Width = 320 ÷ 16 = 20 tiles
- Map Height = 240 ÷ 16 = 15 tiles

### 3.3 Modifying Project Configuration

To edit the configuration after creating the project:

1. Click the **Settings** button (gear icon) in the toolbar
2. Or use the menu **File → Project Settings**
3. Modify the necessary values
4. Click **OK** to save

> **Important**: Changing the tile size will affect all existing tilesets.

---

## 4. Working with Tilesets

### 4.1 Importing a Tileset

**Method 1 - Import Button**:

1. In the **TILESET** panel (left sidebar), click **Import tileset**
2. Select a PNG, JPG, or BMP image
3. The image will be automatically copied to `assets/tilesets/`

**Method 2 - File Menu**:

1. Go to **File → Import Tileset**
2. Select the image

**Recommended Format**:

- Resolution: Multiples of the tile size
- Supported formats: PNG (recommended), JPG, BMP
- Colors: Up to 16 colors for 4bpp

### 4.2 Selecting Tiles

**Individual Selection**:

- Click on a tile in the TILESET panel
- The selected tile is highlighted with a cyan border

**Rectangular Selection**:

- Click on the starting tile
- Drag to the final tile
- Release to confirm the selection

The rectangular selection appears semi-transparent and allows you to paint full patterns at once.

### 4.3 Zoom in the Tileset Panel

- **Zoom In**: Mouse wheel up
- **Zoom Out**: Mouse wheel down
- Zoom adjusts in 0.5x increments (min 1x, max 10x)

### 4.4 Multiple Tilesets

You can import several tilesets in the same project:

1. Import the first tileset normally
2. Repeat the process for additional tilesets
3. Tilesets are displayed one after another in the panel
4. The tile index is global (accumulated between tilesets)

**Example**:

```
Tileset A: 10 tiles (indices 0-9)
Tileset B: 8 tiles (indices 10-17)
Tileset C: 5 tiles (indices 18-22)
```

---

## 5. Scene System

### 5.1 What are Scenes?

Scenes are independent levels or "rooms" within a project. Each scene has:

- Its own dimensions
- Its own layers
- Access to the same project tilesets

### 5.2 Creating a New Scene

1. In the **SCENE** panel, click the **+** (Add Scene) button
2. The new scene is created with the same dimensions as the active scene
3. A "Background" layer is automatically added

### 5.3 Switching Between Scenes

- Click on the name of any scene in the SCENE panel
- The canvas updates automatically
- The layers panel updates to show those of the selected scene

### 5.4 Renaming a Scene

1. Right-click on the scene
2. Select **Rename**
3. Type the new name
4. Press Enter to confirm

### 5.5 Duplicating a Scene

1. Right-click on the scene
2. Select **Duplicate**
3. An exact copy is created with the suffix "(Copy)"

### 5.6 Deleting a Scene

1. Right-click on the scene
2. Select **Delete**
3. Confirm deletion

> **Note**: You cannot delete the last scene in the project.

---

## 6. Editing Tools

### 6.1 Brush Tool

**Basic Use**:

1. Select the Brush tool (key **B**)
2. Select a tile from the TILESET panel
3. Click on the canvas to paint
4. Drag to paint continuously

**Painting Multiple Selections**:

1. Select a rectangular area in the tileset
2. Paint on the canvas - the full pattern will be applied

### 6.2 Rectangle Tool

1. Select the Rectangle tool (key **R**)
2. Click and drag on the canvas
3. Release to fill the area with the selected tile

### 6.3 Eraser Tool

**Method 1 - Dedicated Tool**:

1. Select the Eraser tool (key **E**)
2. Click or drag to erase tiles

**Method 2 - Right Click**:

- In any tool, right-click to erase
- This is a universal shortcut that always works

### 6.4 Pipette Tool (Eyedropper)

1. Select the Pipette tool (key **P**)
2. Click on any tile on the canvas
3. That tile is automatically selected in the TILESET panel

Useful for quickly copying tiles already placed.

### 6.5 Attribute Tool

1. Select the Attribute tool (key **A**)
2. Click on any tile on the canvas to assign or edit attributes
3. Configure tile properties such as collision, special behaviors, or metadata

Useful for defining gameplay properties of specific tiles.

### 6.6 Animation Eyedropper Tool

1. Select the Animation Eyedropper tool (key **I**)
2. Click on any tile on the canvas to select it for animation
3. The tile is automatically linked to the current animation in the Animation Panel

This tool allows you to quickly pick tiles from the canvas and assign them to animations, streamlining the animation workflow.

### 6.7 Live Animation Preview

**Starting/Stopping Preview**:

1. Click the Live Preview button (play/pause icon) in the toolbar
2. Or press the **L** key to toggle preview mode
3. When active, all animated tiles will play their animations in real-time on the canvas

**Features**:
- Shows animations exactly as they will appear in the game
- Synchronized with the ESP32 engine timing
- Performance-optimized for smooth playback
- Works alongside all other editing tools

### 6.8 Pan Tool (Move Canvas)

1. Hold down the **Space** key
2. Drag to move the canvas view
3. Release Space to return to the previous tool

### 6.9 Zoom Controls

| Action | Method |
|--------|--------|
| **Zoom In** | Ctrl + Plus (+) or Ctrl + wheel up |
| **Zoom Out** | Ctrl + Minus (-) or Ctrl + wheel down |
| **Reset Zoom** | Ctrl + 0 (returns to 100%) |
| **Fit to Screen** | Click the "Fit to Screen" button or Ctrl + F |

### 6.10 Tool Preview

When you move the mouse over the canvas:

- A dotted rectangle appears showing where it will paint
- Preview tiles appear semi-transparent (50% opacity)
- This allows you to position precisely before clicking

---

## 7. Tile Animation System

### 7.1 What are Tile Animations?

Tile animations allow you to create dynamic, moving tiles that automatically animate when placed in the game world. This system is synchronized with the PixelRoot32 ESP32 engine to ensure what you see in the editor is exactly what you'll see on the hardware.

**Key Features**:
- **Global Sync**: All instances of an animated tile animate simultaneously
- **Engine-Optimized**: Designed specifically for ESP32 memory constraints
- **Real-time Preview**: See animations playing directly in the canvas
- **Easy Integration**: Automatic C++ export with zero-latency setup

### 7.2 Animation Panel

The Animation Panel is dockable and provides complete control over tile animations.

**Access**: **View → Animation Panel** or click the animation icon in the toolbar

**Panel Components**:
- **Animation List**: Shows all animations in the current project
- **Add/Remove Buttons**: Create new animations or delete selected ones
- **Properties Panel**: Configure animation settings
- **Preview Panel**: See animations playing in real-time

### 7.3 Creating Animations

**Step 1**: Create a new animation
1. Click **Add** in the Animation Panel
2. A "New Animation" appears in the list
3. Select it to configure properties

**Step 2**: Configure animation properties
1. **Name**: Give your animation a descriptive name (e.g., "Water", "Fire", "Coin Spin")
2. **Base Tile**: The first tile index in your animation sequence
3. **Frame Count**: Number of tiles in the animation (2-8 recommended)
4. **Frame Duration**: How long each animation cell is held, in **60 Hz logical ticks** (1–255; e.g. **8** ≈ **133 ms** per cell). Larger values slow the cycle; this matches the engine’s **`TileAnimation::frameDuration`** (not “main loop iterations”).

**Step 3**: Assign tiles to animation
1. Use the **Animation Eyedropper Tool** (I) to pick tiles from the canvas
2. Or manually enter the base tile index
3. The system automatically validates that tiles exist in the tileset

**Example**: Water animation with 4 frames
- Base Tile: 16
- Frame Count: 4 (uses tiles 16, 17, 18, 19)
- Frame Duration: 8 (holds each animation cell for 8 logical ticks at ~60 Hz)

### 7.4 Linking Animations to Tiles

**Method 1: Animation Eyedropper Tool**

1. Select the **Animation Eyedropper Tool** (key **I**)
2. Click on any tile on the canvas
3. The tile is automatically linked to the currently selected animation
4. Visual indicator appears on the tile

**Method 2: Manual Assignment**

1. Select an animation in the Animation Panel
2. Enter the base tile index in the properties panel
3. Click **Apply** to link the animation

**Visual Indicators**:
- Tiles with animations show a small play icon (▶) in the corner
- The icon color indicates the animation status
- Hover over tiles to see animation details

### 7.5 Live Animation Preview

**Starting/Stopping Preview**:

1. Click the **Live Preview** button (play/pause icon) in the toolbar
2. Or press the **L** key to toggle preview mode
3. When active, all animated tiles play their animations in real-time

**Preview Features**:
- **Synchronized Timing**: Uses the same timer system as the ESP32 engine
- **Performance Optimized**: Only renders visible animated tiles
- **Frame Accuracy**: Shows exact frames that will appear in game
- **Multi-layer Support**: Works across all layers simultaneously

**Preview Controls**:
- **Play/Pause**: Toggle animation playback
- **Speed Control**: Adjust preview speed (1x, 2x, 0.5x)
- **Frame Step**: Advance frame by frame for debugging

### 7.6 Animation Validation

The system automatically validates animations to prevent errors:

**Automatic Checks**:
- **Tile Bounds**: Ensures base_tile + frame_count ≤ tileset size
- **Overlap Detection**: Prevents animations from using overlapping tile ranges
- **Memory Constraints**: Validates against ESP32 limits (max 64 animations, 256 total frames)
- **Frame Duration**: Ensures valid timing values (1–255 logical ticks at ~60 Hz)

**Error Messages**:
- **"Animation exceeds tileset bounds"**: Reduce frame count or change base tile
- **"Animations overlap"**: Use non-overlapping tile ranges
- **"Too many animations"**: Reduce number of animations or split across scenes

### 7.7 Exporting Animations to C++

**Automatic Export**:

Animations are automatically included when you export to C++ (File → Export to C++):

**Generated Files**:
```cpp
// scene_name_animations.h
extern const pixelroot32::graphics::TileAnimation scene_name_animations[];
constexpr size_t SCENE_NAME_ANIMATION_COUNT = 2;

// scene_name_animations.cpp
static const pixelroot32::graphics::TileAnimation scene_name_animations[] = {
    { 16, 4, 8, 0 },  // Water animation (base_tile, frame_count, frame_duration, reserved)
    { 32, 2, 12, 0 }  // Fire animation
};
```

**Integration with Multi-Palette Export**:
- **Single Palette Mode**: Animations use shared palette system
- **Multi-Palette Mode**: Animations respect individual layer palettes
- **Automatic Setup**: `setBackgroundCustomPaletteSlot()` calls generated as needed

**Engine Integration**:
```cpp
// In your game code
#include "level1_animations.h"

void game_loop() {
    // Initialize scene
    level1::init();
    
    while (game_running) {
        // Update animations (call once per frame)
        level1::get_animation_manager().step();
        
        // Render tiles (engine automatically uses animated frames)
        render_tilemap();
    }
}
```

### 7.8 Performance and Memory Considerations

**ESP32 Memory Limits**:
- **Maximum Animations**: 64 per scene
- **Maximum Total Frames**: 256 per scene
- **Animation Memory**: 4 bytes per animation
- **Lookup Table**: 1 byte per tile

**Optimization Tips**:
- Use consecutive tiles for each animation
- Keep frame counts reasonable (2-8 frames typical)
- Use appropriate frame durations (8-16 ticks)
- Group similar animations together

**Memory Usage Calculation**:
```cpp
total_animation_memory = animation_count * 4;  // bytes
lookup_table_memory = tile_count * 1;          // bytes
total_memory = total_animation_memory + lookup_table_memory;
```

### 7.9 Best Practices

**Animation Design**:
1. **Keep it Simple**: 2-4 frames are usually sufficient
2. **Loop Seamlessly**: Ensure first and last frames connect smoothly
3. **Test on Hardware**: Verify animations look good on ESP32 display
4. **Document Purpose**: Use descriptive names for animations

**Workflow Tips**:
1. **Create Tile Sequences First**: Design all animation frames in your tileset
2. **Use Live Preview**: Test animations in the editor before exporting
3. **Validate Early**: Check for overlaps and memory issues during development
4. **Export and Test**: Compile and test exported code on target hardware

**Performance Optimization**:
1. **Minimize Frame Count**: Fewer frames = less memory usage
2. **Reuse Tile Ranges**: Multiple animations can share tiles if needed
3. **Optimize Frame Duration**: Balance smoothness with performance
4. **Monitor Memory**: Keep track of total animation memory usage

---

## 8. Layer Management

### 8.1 What are Layers?

Layers allow organizing map elements at different depth levels:

- **Top layer**: Rendered above the others
- **Bottom layer**: Rendered below the others
- Maximum: **4 layers** (ESP32 hardware limitation)

### 8.2 Layer Operations

**Add a layer**:

1. Click **+** in the LAYER panel
2. The new layer is inserted above the selected one

**Delete a layer**:

1. Click the 🗑️ (delete) icon on the layer
2. Confirm deletion
3. You cannot delete the last layer

**Duplicate a layer**:

1. Click the 📄 (duplicate) icon on the layer
2. A copy is created with the suffix "(Copy)"

**Change layer order**:

- Drag and drop layers in the LAYER panel
- Or use the ordering commands

**Rename a layer**:

1. Double-click on the layer name
2. Type the new name
3. Press Enter

### 8.3 Layer Visibility

- Click the 👁️ (eye) icon to show/hide a layer
- Hidden layers are not exported
- Useful for working on specific layers without distractions

### 8.4 Selecting Active Layer

Click on any layer in the panel to select it as the working layer:

- The active layer is highlighted
- All painting operations affect this layer
- **Attribute indicators** (orange triangles) are only visible for the currently selected layer to reduce visual clutter.

### 8.5 Palette Slots per Layer (Multi-Palette)

Each layer can use a **palette slot** (0–7). The PixelRoot32 engine supports up to 8 background palettes; assigning different slots to layers lets you use different color palettes per layer (e.g. background, platforms, stairs, details).

#### **Slot Assignment**

**How to set the palette slot**:
1. Select the layer in the **LAYERS** panel
2. Use the **Palette Slot** control (footer of the panel or layer properties) and choose **P0** to **P7** (slot 0–7)
3. The layer list shows the current slot next to the name, for example: `Background [P0]`, `Platforms [P1]`, `Stairs [P2]`

#### **Automatic Export Mode Detection**

The system automatically analyzes all layers in the scene to determine the export mode:

- **Single Palette Mode**: If ALL layers use slot **P0**
- **Palette Slots Mode**: If AT LEAST ONE layer uses a different slot (P1-P7)

#### **Export Behavior**

**Single Palette Mode** (all layers use P0):
- Generates a **shared palette** for the entire scene
- Creates a **single tile pool** shared between all layers
- All layers use the same palette at runtime

**Palette Slots Mode** (at least one layer uses P1-P7):
- Generates **one individual palette per slot used**
- Creates **one tile pool per layer** with specific color conversion
- Automatically generates calls to `setBackgroundCustomPaletteSlot()`

---

## 9. Tile Attributes

### 9.1 What are Tile Attributes?

Tile attributes allow you to attach custom key-value metadata to tiles for game logic purposes. This metadata can control:

- Collision detection (solid, sensor, oneway)
- Tile interactions (interactable, locked)
- Gameplay behaviors (damage, collectible, trigger)
- Custom properties specific to your game

### 9.2 Two-Level Attribute System

**Tileset Default Attributes**:

- Defined once per tile type in the tileset
- Apply to all instances of that tile
- Example: All "wall" tiles have `solid=true`

**Instance Attributes**:

- Defined per tile placement on the canvas
- Override default attributes for specific tiles
- Example: One specific door has `locked=true`

### 9.3 Tile Flag Rules - Dynamic Rules System

The system includes **Tile Flag Rules** that define how attributes are converted to bit flags in the exported code:

**Rules Structure**:
```json
{
  "rules": [
    {
      "key": "solid",
      "value": true,
      "flags": ["SOLID", "COLLISION"]
    },
    {
      "key": "type",
      "value": ["door", "chest"],
      "flags": ["INTERACTABLE"]
    }
  ]
}
```

**Resolution Hierarchy**:
1. **Project-specific rules** (`project_dir/tile_flag_rules.json`)
2. **Editor default rules** (`modules/tilemap_editor/assets/tile_flag_rules.json`)
3. **Legacy fallback** (hardcoded mapping)

### 9.4 Exporting Attributes to C++

When attributes are exported, the system generates:

- **Behavior Layer**: Array of `TileFlags` generated from attributes and rules
- **Query Functions**: Methods to access attributes at runtime
- **ESP32 Optimization**: Data compacted in flash memory

```cpp
// Example of generated code with attributes
extern const TileFlags BEHAVIOR_LAYER[] = {
    0x01, 0x02, 0x04, 0x01, 0x08, ...
};

// Query attributes at runtime
const char* type = level1::get_tile_attribute(0, x, y, "type");
if (type && strcmp(type, "door") == 0) {
    // Handle door interaction
}
```

### 9.5 Using the Attribute Tool

**Activating the Tool**:

- Click the Attribute Tool icon (tag/label symbol) in the toolbar
- Or press the **A** key

**Editing Tile Attributes**:

1. With the Attribute Tool active, click on any tile on the canvas
2. The Attribute Dialog opens showing:
   - Tile preview
   - Default attributes (marked with "(default)")
   - Instance attributes (specific to this placement)
3. Add, edit, or remove instance attributes
4. Click **"Save"** to apply changes

**Visual Indicator**: Tiles with instance attributes show a small orange triangle on the canvas.

> **Note**: Attribute indicators are only visible for the currently selected layer.

### 9.6 Common Attribute Patterns

**Collision**:

```
solid = true/false
sensor = true/false
oneway = true/false
```

**Interactions**:

```
interactable = true/false
locked = true/false
type = door/chest/switch
```

**Gameplay**:

```
damage = 10
collectible = true/false
trigger = true/false
health = 100
```

---

## 10. Tile Flag Rules

### 10.1 What are Tile Flag Rules?

Tile Flag Rules define how tile attributes are converted to TileFlags (bit flags) in the exported C++ code. These rules control the behavior layer generation for ESP32 runtime.

### 10.2 Rule Resolution Hierarchy

The system resolves rules in this order:

1. **Project-specific rules** (`project_dir/tile_flag_rules.json`)
2. **Editor default rules** (`modules/tilemap_editor/assets/tile_flag_rules.json`)
3. **Legacy fallback** (hardcoded mapping)

### 10.3 Managing Project Rules

Access through **File → Project Settings**, scroll to **"Tile Flag Rules"** section:

**Available Actions**:

**Create Project Rules**:

1. Click **"Create Project Rules"** button
2. A template file is created in your project directory
3. Status bar shows: "✓ Created template rules file: tile_flag_rules.json"

**Reset to Defaults**:

1. Click **"Reset to Defaults"** button
2. Confirm deletion in the dialog
3. Status bar shows: "✓ Reset to editor default rules"

### 10.4 Rule File Format

```json
{
  "version": "1.0",
  "description": "Custom tile flag rules for this project",
  "rules": [
    {
      "key": "solid",
      "value": true,
      "flags": ["TILE_SOLID"]
    },
    {
      "key": "type",
      "value": ["coin", "heart", "powerup"],
      "flags": ["TILE_SENSOR", "TILE_COLLECTIBLE"]
    }
  ]
}
```

**Available TileFlags**:

- `TILE_NONE` (0)
- `TILE_SOLID` (collision)
- `TILE_SENSOR` (trigger without blocking)
- `TILE_DAMAGE` (hurts player)
- `TILE_COLLECTIBLE` (can be collected)
- `TILE_ONEWAY` (one-way platform)
- `TILE_TRIGGER` (activates events)

---

## 11. Onion Skinning

### 11.1 What is Onion Skinning?

Onion skinning shows other translucent scenes over the active scene. It is useful for:

- Aligning exits between levels
- Checking platform consistency
- Comparing designs between scenes

### 11.2 Activating Onion Skinning

**Per individual scene**:

1. In the SCENE panel, click the 🧅 (onion) icon next to a scene
2. The selected scene will appear translucent on the canvas

**Global control**:

1. Activate the **"Show Onion Skin"** checkbox in the SCENE panel
2. This shows/hides all scenes with onion activated

### 11.3 Adjusting Opacity

- Use the **"Opacity"** slider in the SCENE panel
- Recommended value: 0.3 - 0.5 (30% - 50%)
- Default value: 0.4 (40%)

---

## 12. C++ Export

### 12.1 Requirements

C++ export requires a valid license. Without a license, the export button will show 🔒 and redirect to the upgrade dialogue.

### 12.2 Export Process

**Step 1**: Click on **Export** (Ctrl+E) or go to **File → Export to C++**

**Step 2**: Configure options in the export panel:

| Option | Description | Recommendation |
|--------|-------------|---------------|
| **C++ Namespace** | Namespace for generated code | Use project name |
| **Color Depth** | Bit depth (auto-detected) | Leave on auto-detect |
| **Store in Flash (ESP32)** | Save data in PROGMEM | ✅ Always enabled |
| **Legacy Format** | Without Flash attributes | Only for compatibility |

The export **mode** (single-palette vs multi-palette) is chosen automatically from the **palette slots** of your layers: if every layer uses slot P0, you get a single shared palette and one tile pool; if any layer uses P1–P7, you get one palette per slot and one tile pool per layer.

**Step 3**: Click on **Export Now**

**Step 4**: Select destination folder

### 12.3 Generated Files

For a scene called "Level1":

```
level1.h        # Header with declarations and attributes
level1.cpp      # Implementation with data (palettes, tiles, indices)
level1_animations.h  # Animation declarations (if any)
level1_animations.cpp # Animation data (if any)
```

### 12.4 Integration with your Game

**Single-palette** (all layers P0):

```cpp
#include "level1.h"

level1::init();

renderer.drawTileMap(level1::layer_background, x, y);
renderer.drawTileMap(level1::layer_foreground, x, y);
```

**Multi-palette** (layers use different slots):

```cpp
#include "level1.h"

level1::init();  // Registers palettes and fills each TileMap

renderer.drawTileMap(level1::background, 0, 0);
renderer.drawTileMap(level1::platforms,  0, 0);
renderer.drawTileMap(level1::stairs,     0, 0);
renderer.drawTileMap(level1::details,    0, 0);
```

**Querying attributes and behavior**:

```cpp
// Query tile attributes (if using attributes)
const char* type = level1::get_tile_attribute(0, x, y, "type");
if (type && strcmp(type, "door") == 0) {
    // Handle door interaction
}

// Query behavior flags (if using tile flag rules)
uint8_t flags = level1::behavior_layer_background[y * width + x];
if (flags & TILE_SOLID) {
    // Handle collision
}
```

**Animation Integration**:

```cpp
// Update animations (call once per frame)
level1::get_animation_manager().step();

// Render tiles (engine automatically uses animated frames)
renderer.drawTileMap(level1::layer_background, x, y);
```

---

## 13. Advanced Configuration

### 13.1 Editor Preferences

Access through **File → Preferences**:

**Grid Settings**:

- **Canvas Grid Intensity**: Grid opacity (0-255)
- **Tileset Grid Intensity**: Grid opacity in tileset
- **Attribute Indicator Opacity**: Opacity of attribute markers (0.0 to 1.0)

**Auto-save**:

- **Enabled**: Activate/deactivate auto-save
- **Interval**: Minutes between auto-saves (1-60)

**Optimization**:

- **History Compression**: Compresses consecutive operations
- **Use Binary Format**: Uses .bin format by default

### 13.2 File Formats

**JSON (.pr32scene)**:

- ✅ Human readable
- ✅ Easy to version with git
- ❌ Large files
- ❌ Slower loading

**Binary (.pr32scene.bin)**:

- ✅ Small files (up to 335x smaller)
- ✅ Fast Load/Save
- ✅ Recommended for large projects
- ❌ Not directly readable

### 13.3 Binary Format Version 3

The binary format supports multi-palette export with palette slots:

| Version | Features | Compatibility |
|---------|----------|---------------|
| 1 | Basic binary format | ✅ Backward compatible |
| 2 | Added tile attributes | ✅ Backward compatible |
| 3 | Added palette_slot support | ✅ Backward compatible |

**Performance Benefits**:

| Project | JSON | Binary | Reduction |
|---------|------|--------|-----------|
| Small (1 scene) | 2.6 KB | 355 bytes | **86%** |
| Medium (3 scenes) | 227 KB | 752 bytes | **99.7%** |
| Large (10 scenes) | ~1 MB | ~5 KB | **99.5%** |

---

## 14. Keyboard Shortcuts

### 14.1 Tools

| Key | Action |
|-----|--------|
| **B** | Select Brush tool |
| **E** | Select Eraser tool |
| **R** | Select Rectangle tool |
| **P** | Select Pipette tool |
| **A** | Select Attribute tool |
| **I** | Select Animation Eyedropper tool |
| **L** | Toggle Live Animation Preview |
| **Space** | Activate Pan (hold) |

### 14.2 Navigation and Zoom

| Shortcut | Action |
|-----|--------|
| **Ctrl + Wheel** | Zoom in/out |
| **Ctrl + Plus** | Zoom in |
| **Ctrl + Minus** | Zoom out |
| **Ctrl + 0** | Reset zoom to 100% |
| **Ctrl + F** | Fit map to screen |
| **Space + Drag** | Move view (pan) |

### 14.3 Editing

| Shortcut | Action |
|-----|--------|
| **Ctrl + Z** | Undo |
| **Ctrl + Y** | Redo |
| **Ctrl + S** | Save project |
| **Ctrl + E** | Export to C++ |
| **Esc** | Close floating panels |
| **F1** | Show controls/help |

### 14.4 Mouse Shortcuts

| Action | Result |
|--------|--------|
| **Left click** | Paint/Select |
| **Right click** | Erase (any tool) |
| **Wheel up** | Zoom in on tileset |
| **Wheel down** | Zoom out on tileset |
| **Ctrl + Wheel** | Zoom in/out on canvas |

> **Note**: On macOS, use **Cmd** instead of **Ctrl**.

---

## 15. Technical Specifications

### 15.1 Engine Limits

To ensure ESP32 compatibility:

| Parameter | Limit | Description |
|-----------|--------|-------------|
| **Max Tile Size** | 32x32 px | Maximum tile size |
| **Max Map Dimension** | 255x255 tiles | Maximum map dimensions |
| **Max Layers** | 4 | Maximum layers per scene (ESP32 hardware limitation) |
| **Max Unique Tiles** | 256 | Maximum unique tiles per project |
| **Color Depth** | 1/2/4 bpp | Supported color depth |
| **Max Animations** | 64 | Maximum animations per scene |
| **Max Total Frames** | 256 | Maximum total animation frames |

### 15.2 Screen Resolutions

**Landscape Mode**:

- Maximum: 320x240 px
- Aspect ratio: 4:3

**Portrait Mode**:

- Maximum: 240x320 px
- Aspect ratio: 3:4

### 15.3 Data Formats

**Palette**:

- Format: RGB565
- Size: 16 colors (maximum)
- Index 0: Transparent (for multi-bpp)

**Tiles**:

- 1 bpp: 1 byte per row (8 pixels)
- 2 bpp: 2 bytes per row (8 pixels)
- 4 bpp: 4 bytes per row (8 pixels)

**Index Map**:

- 1 byte per cell (uint8_t)
- Value -1 (editor) = Index 0 (exported) = Empty

### 15.4 Project Structure

```
my_project/
├── my_project.pr32scene      # Main file
├── my_project.pr32scene.bin  # Binary version (optional)
├── tile_flag_rules.json      # Project-specific rules (optional)
└── assets/
    └── tilesets/
        ├── tileset1.png
        └── tileset2.png
```

---

## 16. Multi-Palette Export - Complete Guide

### 16.1 Fundamental Concepts

**Multi-Palette Mode** is an advanced feature that allows:
- **Multiple simultaneous palettes** (up to 8, slots P0-P7)
- **Layer-specific color conversion**
- **Memory optimization** for games with color variation
- **Artistic flexibility** without global palette limits

### 16.2 Multi-Palette Workflow

1. **Artistic Planning**:
   - Assign thematic slots (P0: background, P1: platforms, P2: characters)
   - Consider hardware limitations (8 simultaneous palettes)
   - Optimize color reuse between layers

2. **Editor Configuration**:
   - Assign slots to layers using the **Palette Slot** control
   - Visualize slot indicators in the layer panel
   - Verify automatic detection in export mode

3. **Automatic Export**:
   - System automatically detects multi-palette mode
   - Generates individual palettes per slot
   - Creates automatic calls to `setBackgroundCustomPaletteSlot()`

4. **Game Integration**:
   - Palettes are automatically registered in `init()`
   - Each layer uses its own tiles and colors
   - Maintain drawing order for final composition

### 16.3 Technical Considerations

**Engine Limitations**:
- Maximum 8 simultaneous palettes (P0-P7)
- Each palette: maximum 16 colors
- RGB565 conversion for ESP32 hardware

### 16.4 Complete Multi-Palette Example

**Project Configuration**:
```
Scene: "Level 1"
├── Background [P0]    # Base shared palette
├── Platforms [P1]     # Platform-specific colors
├── Stairs [P2]        # Stair-specific colors
└── Details [P3]       # Decoration-specific colors
```

### 16.5 Best Practices

**Palette Planning**:
1. **P0 for common elements**: Background, shared elements
2. **P1-P3 for main elements**: Platforms, characters, UI
3. **P4-P7 for secondary elements**: Effects, decorations, items

**Color Optimization**:
- Limit to 16 colors per palette
- Reuse colors between layers of same slot
- Use similar colors to reduce conversion

---

## Appendix: Troubleshooting

### Problem: The tileset does not display correctly

**Solution**: Verify that the image is a multiple of the configured tile size.

### Problem: Export is very large

**Solution**:

- Use fewer colors (max 16)
- Remove duplicate tiles
- Consider using 2bpp or 1bpp if possible

### Problem: The editor becomes slow

**Solution**:

- Enable "History Compression" in preferences
- Use binary format (.bin)
- Save and close unused scenes

### Problem: Changes are not saved

**Solution**:

- Verify you have write permissions in the folder
- Try "Save As" to a different location
- Check if there are error messages in the console

---

**Happy mapping with PixelRoot32!**

*Documentation updated for Tilemap Editor v1.0.0*

## See also

- [Tools overview](/tools/)
- [Tilemaps (engine guide)](/guide/tilemaps)
- [Tile animation (architecture)](/architecture/ARCH_TILE_ANIMATION)
- [Animated tilemap example](/examples/animated-tilemap)

