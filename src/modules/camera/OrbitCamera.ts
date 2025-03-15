import * as THREE from 'three';
import { injectable } from 'tsyringe';
import { Camera } from './Camera';

export interface OrbitCameraOptions {
  radius?: number;
  minRadius?: number;
  maxRadius?: number;
  rotationSpeed?: number;
  initialTheta?: number;
  initialPhi?: number;
  minPhi?: number;
  maxPhi?: number;
  fov?: number;
  aspect?: number;
  near?: number;
  far?: number;
}

/**
 * A camera that orbits around a target with configurable distance and angles
 */
@injectable()
export class OrbitCamera extends Camera {
  private radius: number;
  private minRadius: number;
  private maxRadius: number;
  private theta: number; // horizontal angle
  private phi: number; // vertical angle
  private rotationSpeed: number;
  private minPhi: number;
  private maxPhi: number;
  private isDragging: boolean = false;
  private previousMousePosition: THREE.Vector2 = new THREE.Vector2();

  constructor(options: OrbitCameraOptions = {}) {
    super('orbitCamera');

    // Initialize with default options
    this.radius = options.radius || 10;
    this.minRadius = options.minRadius || 2;
    this.maxRadius = options.maxRadius || 20;
    this.theta = options.initialTheta || 0;
    this.phi = options.initialPhi || Math.PI / 4;
    this.rotationSpeed = options.rotationSpeed || 1.0;
    this.minPhi = options.minPhi || 0.1;
    this.maxPhi = options.maxPhi || Math.PI / 2 - 0.1; // Avoid gimbal lock

    // Create perspective camera
    this.camera = new THREE.PerspectiveCamera(
      options.fov || 75,
      options.aspect || window.innerWidth / window.innerHeight,
      options.near || 0.1,
      options.far || 1000
    );

    // Update camera position
    this.updateCameraPosition();
  }

  /**
   * Set the orbit radius
   * @param radius - The radius value
   */
  public setRadius(radius: number): void {
    this.radius = Math.max(this.minRadius, Math.min(this.maxRadius, radius));
    this.updateCameraPosition();
  }

  /**
   * Set the minimum and maximum orbit radius
   * @param min - The minimum radius
   * @param max - The maximum radius
   */
  public setRadiusLimits(min: number, max: number): void {
    this.minRadius = min;
    this.maxRadius = max;
    this.radius = Math.max(
      this.minRadius,
      Math.min(this.maxRadius, this.radius)
    );
    this.updateCameraPosition();
  }

  /**
   * Set the rotation speed
   * @param speed - The rotation speed value
   */
  public setRotationSpeed(speed: number): void {
    this.rotationSpeed = speed;
  }

  /**
   * Handle input for camera rotation and zooming
   * @param inputManager - The input manager
   * @param canvas - The canvas element
   */
  public handleInput(
    event: MouseEvent | WheelEvent,
    canvas: HTMLCanvasElement
  ): void {
    const rect = canvas.getBoundingClientRect();

    // Handle mouse wheel for zooming
    if (event instanceof WheelEvent) {
      const zoomAmount = event.deltaY * 0.001 * this.rotationSpeed;
      this.radius = Math.max(
        this.minRadius,
        Math.min(this.maxRadius, this.radius + zoomAmount)
      );
      this.updateCameraPosition();
      return;
    }

    // Handle mouse movement for rotation
    if (event instanceof MouseEvent) {
      const mouseX = ((event.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
      const mouseY =
        -((event.clientY - rect.top) / canvas.clientHeight) * 2 + 1;
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

        this.theta -= deltaX * this.rotationSpeed;
        this.phi = Math.max(
          this.minPhi,
          Math.min(this.maxPhi, this.phi - deltaY * this.rotationSpeed)
        );

        this.previousMousePosition.copy(currentMousePosition);
        this.updateCameraPosition();
      }
    }
  }

  /**
   * Calculate and update the camera position based on spherical coordinates
   */
  private updateCameraPosition(): void {
    if (!this.target) return;

    // Calculate position using spherical coordinates
    const x = this.radius * Math.sin(this.phi) * Math.cos(this.theta);
    const y = this.radius * Math.cos(this.phi);
    const z = this.radius * Math.sin(this.phi) * Math.sin(this.theta);

    // Position the camera relative to the target
    this.camera.position.set(
      this.target.position.x + x,
      this.target.position.y + y,
      this.target.position.z + z
    );

    // Look at the target
    this.camera.lookAt(this.target.position);
  }

  /**
   * Update the camera position and rotation
   * @param deltaTime - Time in seconds since the last frame
   */
  public update(deltaTime: number): void {
    if (!this.target) return;

    // Update the camera position if the target has moved
    this.updateCameraPosition();
  }
}
