import * as THREE from 'three';
import { injectable } from 'tsyringe';
import { Camera } from './Camera';

export interface FirstPersonCameraOptions {
  offset?: THREE.Vector3;
  sensitivity?: number;
  minPitch?: number;
  maxPitch?: number;
  fov?: number;
  aspect?: number;
  near?: number;
  far?: number;
}

/**
 * A camera that simulates a first-person perspective, typically attached to a character
 */
@injectable()
export class FirstPersonCamera extends Camera {
  private offset: THREE.Vector3;
  private sensitivity: number;
  private yaw: number = 0;
  private pitch: number = 0;
  private minPitch: number;
  private maxPitch: number;
  private isDragging: boolean = false;
  private previousMousePosition: THREE.Vector2 = new THREE.Vector2();

  constructor(options: FirstPersonCameraOptions = {}) {
    super('firstPersonCamera');

    // Initialize with default options
    this.offset = options.offset || new THREE.Vector3(0, 1.7, 0);
    this.sensitivity = options.sensitivity || 0.2;
    this.minPitch = options.minPitch || -Math.PI / 2 + 0.1; // Slightly above looking straight down
    this.maxPitch = options.maxPitch || Math.PI / 2 - 0.1; // Slightly below looking straight up

    // Create perspective camera
    this.camera = new THREE.PerspectiveCamera(
      options.fov || 75,
      options.aspect || window.innerWidth / window.innerHeight,
      options.near || 0.1,
      options.far || 1000
    );
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
   * Set the sensitivity for mouse movement
   * @param sensitivity - The sensitivity value
   */
  public setSensitivity(sensitivity: number): void {
    this.sensitivity = sensitivity;
  }

  /**
   * Set the pitch limits
   * @param min - The minimum pitch angle in radians
   * @param max - The maximum pitch angle in radians
   */
  public setPitchLimits(min: number, max: number): void {
    this.minPitch = min;
    this.maxPitch = max;
    this.pitch = Math.max(this.minPitch, Math.min(this.maxPitch, this.pitch));
  }

  /**
   * Handle mouse input for camera rotation
   * @param event - The mouse event
   * @param canvas - The canvas element
   */
  public handleInput(event: MouseEvent, canvas: HTMLCanvasElement): void {
    const rect = canvas.getBoundingClientRect();
    const mouseX = ((event.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
    const mouseY = -((event.clientY - rect.top) / canvas.clientHeight) * 2 + 1;
    const currentMousePosition = new THREE.Vector2(mouseX, mouseY);

    // Handle mouse down
    if (event.type === 'mousedown' && event.button === 0) {
      this.isDragging = true;
      this.previousMousePosition.copy(currentMousePosition);
    }
    // Handle mouse up
    else if (event.type === 'mouseup' && event.button === 0) {
      this.isDragging = false;
    }
    // Handle mouse move
    else if (event.type === 'mousemove' && this.isDragging) {
      const deltaX = currentMousePosition.x - this.previousMousePosition.x;
      const deltaY = currentMousePosition.y - this.previousMousePosition.y;

      // Update yaw (horizontal rotation)
      this.yaw -= deltaX * this.sensitivity;

      // Update pitch (vertical rotation) with clamping
      this.pitch = Math.max(
        this.minPitch,
        Math.min(this.maxPitch, this.pitch + deltaY * this.sensitivity)
      );

      this.previousMousePosition.copy(currentMousePosition);
    }
  }

  /**
   * Lock the pointer to enable continuous camera rotation
   */
  public lockPointer(canvas: HTMLCanvasElement): void {
    canvas.requestPointerLock();
  }

  /**
   * Handle pointer lock movement events
   * @param event - The pointer move event
   */
  public handlePointerLockMovement(event: MouseEvent): void {
    // Update yaw (horizontal rotation)
    this.yaw -= event.movementX * this.sensitivity * 0.01;

    // Update pitch (vertical rotation) with clamping
    this.pitch = Math.max(
      this.minPitch,
      Math.min(
        this.maxPitch,
        this.pitch - event.movementY * this.sensitivity * 0.01
      )
    );
  }

  /**
   * Update the camera position and rotation
   * @param deltaTime - Time in seconds since the last frame
   */
  public update(deltaTime: number): void {
    if (!this.target) return;

    // Position camera at target + offset
    this.camera.position.copy(this.target.position).add(this.offset);

    // Create rotation quaternion from yaw and pitch
    const quaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(this.pitch, this.yaw, 0, 'YXZ')
    );

    // Apply rotation to camera
    this.camera.quaternion.copy(quaternion);
  }
}
