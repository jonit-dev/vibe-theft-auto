# Events Module

The Events Module provides a central event system for communication between different parts of the game engine.

## Purpose

This module enables:

- Decoupled communication between systems
- Event-driven architecture
- Observer pattern implementation
- Cross-component coordination
- Game-wide messaging

## Components

### EventBus

The central event bus that manages event registration and dispatching:

```typescript
@injectable()
@singleton()
class EventBus {
  // Register an event listener
  on<T>(eventType: string, callback: (data: T) => void): void;

  // Register a one-time event listener
  once<T>(eventType: string, callback: (data: T) => void): void;

  // Remove an event listener
  off<T>(eventType: string, callback: (data: T) => void): void;

  // Emit an event with data
  emit<T>(eventType: string, data: T): void;

  // Clear all listeners for an event type
  clear(eventType: string): void;
}
```

### EventTypes

Standard event types used throughout the engine:

```typescript
enum EngineEventType {
  // Engine lifecycle events
  ENGINE_INITIALIZED = 'engine.initialized',
  ENGINE_START = 'engine.start',
  ENGINE_STOP = 'engine.stop',

  // Game object events
  GAME_OBJECT_CREATED = 'gameObject.created',
  GAME_OBJECT_DESTROYED = 'gameObject.destroyed',

  // Scene events
  SCENE_LOADED = 'scene.loaded',
  SCENE_UNLOADED = 'scene.unloaded',
  SCENE_SWITCHED = 'scene.switched',

  // Resource events
  RESOURCE_LOADED = 'resource.loaded',
  RESOURCE_UNLOADED = 'resource.unloaded',

  // Input events
  KEY_DOWN = 'input.keyDown',
  KEY_UP = 'input.keyUp',
  MOUSE_MOVE = 'input.mouseMove',
  MOUSE_DOWN = 'input.mouseDown',
  MOUSE_UP = 'input.mouseUp',

  // Custom events can be added by applications
}
```

## Usage Examples

```typescript
// Subscribing to events
@injectable()
class PlayerController {
  constructor(private eventBus: EventBus) {
    // Listen for input events
    this.eventBus.on(EngineEventType.KEY_DOWN, this.handleKeyDown.bind(this));
    this.eventBus.on(EngineEventType.KEY_UP, this.handleKeyUp.bind(this));
  }

  private handleKeyDown(key: string): void {
    // Handle player input
    if (key === 'ArrowUp') {
      // Move forward
    }
  }

  private handleKeyUp(key: string): void {
    // Handle key release
  }

  // Remember to clean up when destroyed
  destroy(): void {
    this.eventBus.off(EngineEventType.KEY_DOWN, this.handleKeyDown.bind(this));
    this.eventBus.off(EngineEventType.KEY_UP, this.handleKeyUp.bind(this));
  }
}

// Emitting events
@injectable()
class InputManager {
  constructor(private eventBus: EventBus) {}

  update(): void {
    // Check for input and emit events
    if (this.isKeyPressed('ArrowUp')) {
      this.eventBus.emit(EngineEventType.KEY_DOWN, 'ArrowUp');
    }
  }
}
```

## Best Practices

1. **Use typed events**: Always define clear event data structures
2. **Clean up listeners**: Remove event listeners when components are destroyed
3. **Avoid overuse**: Don't rely on events for everything - use direct method calls where appropriate
4. **Document events**: Keep a central registry of all used event types
5. **Consider performance**: High-frequency events can impact performance

## Future Enhancements

- Event priorities
- Event bubbling/propagation
- Asynchronous events
- Event filtering capabilities
- Debug tools for event tracing
