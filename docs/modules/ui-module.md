# UI Module

The UI Module manages the user interface components and interactions in the game engine.

## Purpose

This module handles:

- Game UI rendering
- HUD elements
- Menus and UI screens
- UI component management
- User interface interactions

## Components

### UIService

The central service that manages UI components and rendering:

```typescript
@injectable()
@singleton()
class UIService {
  // Register UI components
  registerComponent(key: string, component: React.ComponentType): void;

  // Show/hide UI elements
  showComponent(key: string, props?: any): void;
  hideComponent(key: string): void;

  // Update UI component props
  updateComponent(key: string, props: any): void;

  // Check if a component is visible
  isVisible(key: string): boolean;
}
```

### UI Components

React-based UI components for common game interfaces:

- **HUD**: In-game heads-up display
- **Menu**: Game menu screens
- **Dialog**: Dialog/message boxes
- **Inventory**: Item management interfaces
- **StatusEffects**: Visual indicators for status effects

## Usage Examples

```typescript
// In a game scene or component
@injectable()
class GameManager {
  constructor(private uiService: UIService) {
    // Register UI components
    this.uiService.registerComponent('main-menu', MainMenu);
    this.uiService.registerComponent('hud', PlayerHUD);
    this.uiService.registerComponent('inventory', InventoryScreen);
  }

  showMainMenu(): void {
    this.uiService.showComponent('main-menu', {
      onStart: this.startGame.bind(this),
    });
  }

  startGame(): void {
    this.uiService.hideComponent('main-menu');
    this.uiService.showComponent('hud', { playerHealth: 100 });
  }

  updatePlayerHealth(health: number): void {
    this.uiService.updateComponent('hud', { playerHealth: health });
  }
}
```

## Dependencies

- React for UI components
- Event system for UI events
- Rendering module for UI rendering context

## Future Enhancements

- UI animation system
- Theming and styling framework
- Responsive UI scaling
- Input binding display
- UI sound effects integration
