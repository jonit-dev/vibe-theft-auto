import * as THREE from 'three';
import { GameObject } from '../../core/GameObject';

/**
 * Abstract base class for all camera types
 */
export abstract class Camera {
  protected camera!: THREE.Camera;
  protected target: THREE.Object3D | null = null;
  protected name: string;

  constructor(name: string = 'camera') {
    this.name = name;
  }

  /**
   * Get the underlying Three.js camera
   */
  public getThreeCamera(): THREE.Camera {
    return this.camera;
  }

  /**
   * Set the target object for the camera to follow or look at
   * @param target - The target object
   */
  public setTarget(target: THREE.Object3D | GameObject): void {
    this.target = target instanceof GameObject ? target.getObject3D() : target;
  }

  /**
   * Get the target object
   */
  public getTarget(): THREE.Object3D | null {
    return this.target;
  }

  /**
   * Get the camera name
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Set the camera name
   */
  public setName(name: string): void {
    this.name = name;
  }

  /**
   * Update the camera
   * @param deltaTime - Time in seconds since the last frame
   */
  public abstract update(deltaTime: number): void;
}
