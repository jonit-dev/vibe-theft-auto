import { container } from 'tsyringe';
import { InputManager } from '../../utils/InputManager';
import { Component } from '../Component';
import { GameObject } from '../GameObject';
import { Rotator } from './Rotator';
import { Transform } from './Transform';

/**
 * CubeController component for interactive cube behavior
 * Example of a component that uses other components and responds to input
 */
export class CubeController extends Component {
  private transform: Transform | null = null;
  private rotator: Rotator | null = null;
  private inputManager: InputManager;
  private moveSpeed: number = 2.0;

  constructor(gameObject: GameObject) {
    super(gameObject);
    // Get the InputManager instance from the container
    this.inputManager = container.resolve(InputManager);
  }

  protected start(): void {
    // Get required components
    this.transform = this.gameObject.getComponent(Transform);
    this.rotator = this.gameObject.getComponent(Rotator);

    // Add Transform component if it doesn't exist
    if (!this.transform) {
      this.transform = this.gameObject.addComponent(Transform);
    }

    // Add Rotator component if it doesn't exist but make it disabled by default
    if (!this.rotator) {
      this.rotator = this.gameObject.addComponent(Rotator);
      this.rotator!.setRotationSpeed(0, 1, 0);
      this.rotator!.setEnabled(false);
    }

    console.log(`CubeController started for ${this.gameObject.getId()}`);
  }

  update(deltaTime: number): void {
    if (!this.transform || !this.isEnabled()) return;

    // Handle keyboard input
    if (this.inputManager.isKeyPressed('ArrowUp')) {
      this.transform.translate(0, this.moveSpeed * deltaTime, 0);
    }

    if (this.inputManager.isKeyPressed('ArrowDown')) {
      this.transform.translate(0, -this.moveSpeed * deltaTime, 0);
    }

    if (this.inputManager.isKeyPressed('ArrowLeft')) {
      this.transform.translate(-this.moveSpeed * deltaTime, 0, 0);
    }

    if (this.inputManager.isKeyPressed('ArrowRight')) {
      this.transform.translate(this.moveSpeed * deltaTime, 0, 0);
    }

    // Toggle rotation with spacebar
    if (this.inputManager.isKeyJustPressed(' ') && this.rotator) {
      this.rotator.setEnabled(!this.rotator.isEnabled());
      console.log(
        `Rotation ${
          this.rotator.isEnabled() ? 'enabled' : 'disabled'
        } for ${this.gameObject.getId()}`
      );
    }
  }

  destroy(): void {
    console.log(`CubeController destroyed for ${this.gameObject.getId()}`);
  }
}
