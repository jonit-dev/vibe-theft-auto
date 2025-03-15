# Input Module

The Input Module handles all user input interactions, including keyboard, mouse, touch, and gamepad control in the game engine.

## Purpose

This module is responsible for:

- Keyboard input detection and management
- Mouse input and pointer events
- Touch input for mobile devices
- Gamepad/controller support
- Input mapping and configuration
- Input-related events

## Current Status

⚠️ **Planned for Migration**: The input functionality currently exists as `InputManager` in the `utils` directory and needs to be migrated to the modules structure.

## Components

### InputManager

The central service that coordinates all input handling:

```typescript
@injectable()
@singleton()
class InputManager {
  // Keyboard input
  isKeyPressed(key: string): boolean;
  isKeyJustPressed(key: string): boolean;
  isKeyJustReleased(key: string): boolean;

  // Mouse input
  getMousePosition(): Vector2;
  isMouseButtonPressed(button: number): boolean;
  getMouseDelta(): Vector2;

  // Touch input
  getTouchPosition(touchId: number): Vector2;
  isTouching(): boolean;

  // Gamepad input (planned)
  isGamepadButtonPressed(button: GamepadButton): boolean;
  getGamepadAxis(axis: GamepadAxis): number;

  // Update (called every frame)
  update(): void;
}
```

### InputBindings

System for mapping input to actions:

```typescript
@injectable()
class InputBindingManager {
  // Register an action with bindings
  registerAction(action: string, bindings: InputBinding[]): void;

  // Check if an action is active
  isActionActive(action: string): boolean;

  // Get all active actions
  getActiveActions(): string[];

  // Load/save bindings
  loadBindings(config: InputConfig): void;
  saveBindings(): InputConfig;
}
```

## Planned Features

- **Keyboard input**: Key press, hold, and release detection
- **Mouse input**: Position, movement, buttons, and scroll
- **Touch input**: Multi-touch support for mobile games
- **Gamepad support**: Cross-platform controller input
- **Input mapping**: Configurable input bindings
- **Action system**: Context-aware input handling
- **Input recording**: For replays and debugging

## Usage Examples

```typescript
// In a player controller
@injectable()
class PlayerController {
  constructor(private inputManager: InputManager) {}

  update(deltaTime: number): void {
    // Check direct input
    if (
      this.inputManager.isKeyPressed('ArrowUp') ||
      this.inputManager.isKeyPressed('w')
    ) {
      this.moveForward(deltaTime);
    }

    // Get continuous input values
    const mouseDelta = this.inputManager.getMouseDelta();
    this.rotate(
      mouseDelta.x * this.sensitivity,
      mouseDelta.y * this.sensitivity
    );

    // Handle mouse buttons
    if (this.inputManager.isMouseButtonPressed(0)) {
      this.shoot();
    }
  }
}

// With input bindings
@injectable()
class GameController {
  constructor(private inputBindings: InputBindingManager) {
    // Set up input bindings
    this.inputBindings.registerAction('move_forward', [
      { type: 'key', code: 'ArrowUp' },
      { type: 'key', code: 'w' },
      { type: 'gamepad', code: 'dpad_up' },
    ]);

    this.inputBindings.registerAction('shoot', [
      { type: 'mouse', code: 0 },
      { type: 'gamepad', code: 'button_right_trigger' },
    ]);
  }

  update(deltaTime: number): void {
    // Check for actions rather than specific inputs
    if (this.inputBindings.isActionActive('move_forward')) {
      this.moveForward(deltaTime);
    }

    if (this.inputBindings.isActionActive('shoot')) {
      this.shoot();
    }
  }
}
```

## Dependencies

- Events module for input events
- DOM APIs for input detection

## Migration Plan

1. Create the module directory structure (`src/modules/input/`)
2. Move the InputManager class from utils to the new module
3. Refactor to use module pattern with proper interfaces
4. Update imports throughout the codebase
5. Enhance with additional features (bindings, gamepad support)
