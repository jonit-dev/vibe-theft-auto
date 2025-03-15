import { Component } from '@/core/Component';
import { IGameObject } from '@/core/interfaces/IGameObject';
import { Transform } from './Transform';

/**
 * Rotator component that continuously rotates a game object
 * Example of a component using update method and requiring another component
 */
export class Rotator extends Component {
  private transform: Transform | null = null;
  private rotationSpeed: { x: number; y: number; z: number } = {
    x: 0,
    y: 0,
    z: 0,
  };

  constructor(gameObject: IGameObject) {
    super(gameObject);
  }

  protected start(): void {
    // Get the Transform component
    this.transform = this.gameObject.getComponent(Transform);

    // If no Transform component exists, add one
    if (!this.transform) {
      this.transform = this.gameObject.addComponent(Transform);
    }
  }

  /**
   * Set the rotation speed in radians per second
   */
  public setRotationSpeed(x: number, y: number, z: number): void {
    this.rotationSpeed.x = x;
    this.rotationSpeed.y = y;
    this.rotationSpeed.z = z;
  }

  /**
   * Called every frame
   */
  update(deltaTime: number): void {
    // Skip if no transform or component is disabled
    if (!this.transform || !this.isEnabled()) return;

    // Rotate based on rotation speed and delta time
    this.transform.rotate(
      this.rotationSpeed.x * deltaTime,
      this.rotationSpeed.y * deltaTime,
      this.rotationSpeed.z * deltaTime
    );
  }
}
