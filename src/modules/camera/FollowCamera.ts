import * as THREE from 'three';
import { injectable } from 'tsyringe';
import { Camera } from './Camera';

export interface FollowCameraOptions {
  offset?: THREE.Vector3;
  damping?: number;
  lookAtTarget?: boolean;
  fov?: number;
  aspect?: number;
  near?: number;
  far?: number;
}

/**
 * A camera that follows a target object with configurable offset and smoothing
 */
@injectable()
export class FollowCamera extends Camera {
  private offset: THREE.Vector3;
  private damping: number;
  private lookAtTarget: boolean;
  private currentPosition: THREE.Vector3;
  private targetPosition: THREE.Vector3;

  constructor(options: FollowCameraOptions = {}) {
    super(options.fov ? 'followCamera' : 'followCamera');

    // Initialize with default options
    this.offset = options.offset || new THREE.Vector3(0, 5, 10);
    this.damping = options.damping !== undefined ? options.damping : 5.0;
    this.lookAtTarget =
      options.lookAtTarget !== undefined ? options.lookAtTarget : true;

    // Create perspective camera
    this.camera = new THREE.PerspectiveCamera(
      options.fov || 75,
      options.aspect || window.innerWidth / window.innerHeight,
      options.near || 0.1,
      options.far || 1000
    );

    this.currentPosition = new THREE.Vector3();
    this.targetPosition = new THREE.Vector3();
  }

  /**
   * Set the offset from the target
   * @param offset - The offset vector
   */
  public setOffset(offset: THREE.Vector3): void {
    this.offset = offset.clone();
  }

  /**
   * Get the current offset
   */
  public getOffset(): THREE.Vector3 {
    return this.offset.clone();
  }

  /**
   * Set the damping factor (higher = smoother, lower = more responsive)
   * @param damping - The damping factor
   */
  public setDamping(damping: number): void {
    this.damping = damping;
  }

  /**
   * Enable or disable looking at the target
   * @param lookAtTarget - Whether to look at the target
   */
  public setLookAtTarget(lookAtTarget: boolean): void {
    this.lookAtTarget = lookAtTarget;
  }

  /**
   * Update the camera position and rotation
   * @param deltaTime - Time in seconds since the last frame
   */
  public update(deltaTime: number): void {
    if (!this.target) return;

    // Calculate the target position (target + offset)
    this.targetPosition.copy(this.target.position).add(this.offset);

    // Smoothly move toward the target position using damping
    this.currentPosition.copy(this.camera.position);

    // Apply damping: currentPos += (targetPos - currentPos) * damping * deltaTime
    this.currentPosition.lerp(
      this.targetPosition,
      Math.min(1.0, this.damping * deltaTime)
    );

    // Update camera position
    this.camera.position.copy(this.currentPosition);

    // Make the camera look at the target if needed
    if (this.lookAtTarget) {
      this.camera.lookAt(this.target.position);
    }
  }
}
