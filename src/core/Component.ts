import { IGameObject } from '@/core/interfaces/IGameObject';

/**
 * Base Component class that all components should extend
 * Inspired by Unity-like component architecture
 */
export abstract class Component {
  // Reference to the parent GameObject
  protected gameObject: IGameObject;
  // Whether the component is enabled
  private enabled: boolean = true;
  // Whether the component has been initialized
  private initialized: boolean = false;

  constructor(gameObject: IGameObject) {
    this.gameObject = gameObject;
  }

  /**
   * Internal method called by the GameObject
   * Ensures start is only called once
   */
  internal_start(): void {
    if (!this.initialized && this.enabled) {
      this.start();
      this.initialized = true;
    }
  }

  /**
   * Called when the component is first initialized
   * Only called once during the component's lifecycle
   */
  protected start(): void {}

  /**
   * Called once per frame, if the component is enabled
   * @param deltaTime Time in seconds since last frame
   */
  update(deltaTime: number): void {}

  /**
   * Called when the component or its game object is destroyed
   */
  destroy(): void {}

  /**
   * Called when the component is enabled
   */
  onEnable(): void {}

  /**
   * Called when the component is disabled
   */
  onDisable(): void {}

  /**
   * Check if the component is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Enable or disable the component
   */
  setEnabled(enabled: boolean): void {
    if (this.enabled === enabled) return;

    this.enabled = enabled;

    if (enabled) {
      this.onEnable();
    } else {
      this.onDisable();
    }
  }

  /**
   * Get the parent GameObject
   */
  getGameObject(): IGameObject {
    return this.gameObject;
  }
}
