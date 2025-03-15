import { Component } from '@/core/Component';
import { IGameObject } from '@/core/interfaces/IGameObject';
import { CameraService } from '@modules/camera';
import { InputManager } from '@modules/input/InputManager';
import * as THREE from 'three';
import { container } from 'tsyringe';

export class PlayerMovementComponent extends Component {
  private inputManager: InputManager;
  private cameraService: CameraService;
  private moveSpeed: number = 5;
  private jumpForce: number = 8;
  private gravity: number = 20;
  private velocity: THREE.Vector3 = new THREE.Vector3();
  private isGrounded: boolean = true;
  private jumpCooldown: number = 0;

  // Camera for directional movement
  private camera: THREE.Camera | null = null;

  constructor(gameObject: IGameObject) {
    super(gameObject);
    this.inputManager = container.resolve(InputManager);
    this.cameraService = container.resolve(CameraService);
  }

  protected start(): void {
    // Initialize component
    this.velocity = new THREE.Vector3();
  }

  update(deltaTime: number): void {
    if (!this.isEnabled()) return;

    // Get camera for direction
    if (!this.camera) {
      this.camera = this.cameraService.getThreeCamera();
    }

    if (!this.camera) return;

    // Get active camera type
    const activeCamera = this.cameraService.getActiveCamera();
    const isFirstPerson = activeCamera?.getName() === 'firstPerson';

    // Apply gravity
    if (!this.isGrounded) {
      this.velocity.y -= this.gravity * deltaTime;
    }

    // Update jump cooldown
    if (this.jumpCooldown > 0) {
      this.jumpCooldown -= deltaTime;
    }

    // Handle movement
    const moveDirection = this.calculateMoveDirection();
    const object3D = this.gameObject.getObject3D();

    // Apply horizontal movement
    object3D.position.x += moveDirection.x * this.moveSpeed * deltaTime;
    object3D.position.z += moveDirection.z * this.moveSpeed * deltaTime;

    // Apply vertical velocity (gravity/jumping)
    object3D.position.y += this.velocity.y * deltaTime;

    // Ground check (simple implementation)
    if (object3D.position.y <= 1) {
      object3D.position.y = 1;
      this.velocity.y = 0;
      this.isGrounded = true;
    }

    // Handle jumping - check for both 'Space' and ' ' (spacebar)
    if (
      (this.inputManager.isKeyPressed('Space') ||
        this.inputManager.isKeyPressed(' ') ||
        this.inputManager.isKeyPressed('space')) &&
      this.isGrounded &&
      this.jumpCooldown <= 0
    ) {
      console.log('Jump triggered!');
      this.velocity.y = this.jumpForce;
      this.isGrounded = false;
      this.jumpCooldown = 0.3; // Prevent jump spam
    }

    // Rotate player to face movement direction (only in third-person modes)
    if (!isFirstPerson && (moveDirection.x !== 0 || moveDirection.z !== 0)) {
      const angle = Math.atan2(moveDirection.x, moveDirection.z);
      // Smooth rotation
      const currentRotation = object3D.rotation.y;
      const targetRotation = angle;

      // Use simple lerp for smoother rotation
      const rotationSpeed = 10 * deltaTime;
      object3D.rotation.y =
        currentRotation + (targetRotation - currentRotation) * rotationSpeed;
    }
  }

  private calculateMoveDirection(): THREE.Vector3 {
    const direction = new THREE.Vector3();

    if (!this.camera) return direction;

    // Get camera direction vectors
    const cameraDirection = new THREE.Vector3();
    this.camera.getWorldDirection(cameraDirection);

    // Get the active camera from the service
    const activeCamera = this.cameraService.getActiveCamera();
    const isFirstPerson = activeCamera?.getName() === 'firstPerson';

    // For first-person, we want to move exactly where we're looking
    // For other cameras, we keep movement on the horizontal plane
    if (!isFirstPerson) {
      cameraDirection.y = 0; // Keep movement on horizontal plane for third-person views
    }

    cameraDirection.normalize();

    // Calculate right vector - always perpendicular to world up vector
    const right = new THREE.Vector3();
    right.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0));
    right.normalize();

    // Add movement based on key input - check multiple key formats
    if (
      this.inputManager.isKeyPressed('KeyW') ||
      this.inputManager.isKeyPressed('w') ||
      this.inputManager.isKeyPressed('W') ||
      this.inputManager.isKeyPressed('ArrowUp')
    ) {
      // In first person, move exactly where camera is facing (including Y component)
      // In other modes, move on the XZ plane
      direction.add(cameraDirection);
    }
    if (
      this.inputManager.isKeyPressed('KeyS') ||
      this.inputManager.isKeyPressed('s') ||
      this.inputManager.isKeyPressed('S') ||
      this.inputManager.isKeyPressed('ArrowDown')
    ) {
      direction.sub(cameraDirection);
    }
    if (
      this.inputManager.isKeyPressed('KeyA') ||
      this.inputManager.isKeyPressed('a') ||
      this.inputManager.isKeyPressed('A') ||
      this.inputManager.isKeyPressed('ArrowLeft')
    ) {
      direction.sub(right);
    }
    if (
      this.inputManager.isKeyPressed('KeyD') ||
      this.inputManager.isKeyPressed('d') ||
      this.inputManager.isKeyPressed('D') ||
      this.inputManager.isKeyPressed('ArrowRight')
    ) {
      direction.add(right);
    }

    if (direction.length() > 0) {
      direction.normalize();

      // Special handling for first-person mode
      if (isFirstPerson) {
        // For first-person, we might need to adjust the vertical component
        // to prevent unintended vertical movement
        if (!this.isGrounded) {
          // If in the air, don't move vertically based on look direction
          direction.y = 0;
          if (direction.length() > 0) {
            direction.normalize();
          }
        }
      }
    }

    return direction;
  }

  // Utility methods
  setMoveSpeed(speed: number): PlayerMovementComponent {
    this.moveSpeed = speed;
    return this;
  }

  setJumpForce(force: number): PlayerMovementComponent {
    this.jumpForce = force;
    return this;
  }

  setGravity(gravity: number): PlayerMovementComponent {
    this.gravity = gravity;
    return this;
  }

  setCamera(camera: THREE.Camera): PlayerMovementComponent {
    this.camera = camera;
    return this;
  }
}
