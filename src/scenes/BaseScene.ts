import * as THREE from 'three';

export abstract class BaseScene {
  protected scene: THREE.Scene;

  constructor() {
    this.scene = new THREE.Scene();
  }

  /**
   * Called when the scene is entered
   */
  abstract onEnter(): void;

  /**
   * Called when the scene is exited
   */
  abstract onExit(): void;

  /**
   * Update loop for scene logic
   * @param deltaTime Time in seconds since last frame
   */
  abstract update(deltaTime: number): void;

  /**
   * Get the Three.js scene
   */
  public getThreeScene(): THREE.Scene {
    return this.scene;
  }
}
