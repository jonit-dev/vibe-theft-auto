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
  private previousMousePosition: { x: number; y: number } = { x: 0, y: 0 };

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

    // Initial update to position the camera
    this.updateCameraPosition();
  }

  /**
   * Set the radius (distance from target)
   */
  public setRadius(radius: number): void {
    this.radius = Math.max(this.minRadius, Math.min(this.maxRadius, radius));
    this.updateCameraPosition();
  }

  /**
   * Set the minimum and maximum radius limits
   */
  public setRadiusLimits(min: number, max: number): void {
    this.minRadius = min;
    this.maxRadius = max;

    // Ensure current radius is within limits
    this.radius = Math.max(
      this.minRadius,
      Math.min(this.maxRadius, this.radius)
    );
    this.updateCameraPosition();
  }

  /**
   * Set the rotation speed
   */
  public setRotationSpeed(speed: number): void {
    this.rotationSpeed = speed;
  }

  /**
   * Handle mouse input for orbit controls
   */
  public handleInput(
    event: MouseEvent | WheelEvent,
    canvas: HTMLCanvasElement
  ): void {
    console.log(`OrbitCamera handling input: ${event.type}`);

    // Handle mouse wheel for zooming
    if (event instanceof WheelEvent) {
      const zoomAmount = event.deltaY * 0.005; // Increased sensitivity
      this.radius = Math.max(
        this.minRadius,
        Math.min(this.maxRadius, this.radius + zoomAmount)
      );
      console.log(`Zoom adjusted to radius: ${this.radius}`);
      this.updateCameraPosition();
      return;
    }

    // Handle mouse movement for rotation
    if (event instanceof MouseEvent) {
      // Handle mouse down
      if (event.type === 'mousedown' && event.button === 0) {
        this.isDragging = true;
        this.previousMousePosition = {
          x: event.clientX,
          y: event.clientY,
        };
        console.log('Mouse down - starting orbit drag');
      }
      // Handle mouse up
      else if (event.type === 'mouseup' && event.button === 0) {
        this.isDragging = false;
        console.log('Mouse up - ending orbit drag');
      }
      // Handle mouse move
      else if (event.type === 'mousemove' && this.isDragging) {
        // Calculate mouse movement directly from screen pixels
        const deltaX =
          (event.clientX - this.previousMousePosition.x) *
          0.01 *
          this.rotationSpeed;
        const deltaY =
          (event.clientY - this.previousMousePosition.y) *
          0.01 *
          this.rotationSpeed;

        // Update angles based on mouse movement
        this.theta -= deltaX;
        this.phi = Math.max(
          this.minPhi,
          Math.min(this.maxPhi, this.phi - deltaY)
        );

        console.log(
          `Orbit updated: theta=${this.theta.toFixed(
            2
          )}, phi=${this.phi.toFixed(2)}`
        );

        // Store current mouse position for next frame
        this.previousMousePosition = {
          x: event.clientX,
          y: event.clientY,
        };

        // Update camera position based on new angles
        this.updateCameraPosition();
      }
    }
  }

  /**
   * Calculate and update the camera position based on spherical coordinates
   */
  private updateCameraPosition(): void {
    if (!this.target) return;

    // Calculate position in spherical coordinates
    const x = this.radius * Math.sin(this.phi) * Math.sin(this.theta);
    const y = this.radius * Math.cos(this.phi);
    const z = this.radius * Math.sin(this.phi) * Math.cos(this.theta);

    const targetPosition = new THREE.Vector3();
    this.target.getWorldPosition(targetPosition);

    // Set camera position relative to target
    this.camera.position.set(
      targetPosition.x + x,
      targetPosition.y + y,
      targetPosition.z + z
    );

    // Look at the target
    this.camera.lookAt(targetPosition);

    // Update projection matrix if it's a PerspectiveCamera or OrthographicCamera
    if (
      this.camera instanceof THREE.PerspectiveCamera ||
      this.camera instanceof THREE.OrthographicCamera
    ) {
      this.camera.updateProjectionMatrix();
    }
  }

  /**
   * Update camera position each frame
   */
  public update(deltaTime: number): void {
    if (this.target) {
      this.updateCameraPosition();
    }
  }
}
