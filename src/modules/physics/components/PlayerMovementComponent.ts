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

    // Apply movement
    const object3D = this.gameObject.getObject3D();

    // Apply velocity
    object3D.position.x += moveDirection.x * this.moveSpeed * deltaTime;
    object3D.position.z += moveDirection.z * this.moveSpeed * deltaTime;
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

    // Rotate player to face movement direction
    if (moveDirection.x !== 0 || moveDirection.z !== 0) {
      const angle = Math.atan2(moveDirection.x, moveDirection.z);
      object3D.rotation.y = angle;
    }
  }

  private calculateMoveDirection(): THREE.Vector3 {
    const direction = new THREE.Vector3();

    if (!this.camera) return direction;

    // Get camera direction vectors
    const cameraDirection = new THREE.Vector3();
    this.camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0; // Keep movement on horizontal plane
    cameraDirection.normalize();

    // Calculate right vector
    const right = new THREE.Vector3();
    right.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0));

    // Add movement based on key input - check multiple key formats
    if (
      this.inputManager.isKeyPressed('KeyW') ||
      this.inputManager.isKeyPressed('w') ||
      this.inputManager.isKeyPressed('W')
    ) {
      direction.add(cameraDirection);
    }
    if (
      this.inputManager.isKeyPressed('KeyS') ||
      this.inputManager.isKeyPressed('s') ||
      this.inputManager.isKeyPressed('S')
    ) {
      direction.sub(cameraDirection);
    }
    if (
      this.inputManager.isKeyPressed('KeyA') ||
      this.inputManager.isKeyPressed('a') ||
      this.inputManager.isKeyPressed('A')
    ) {
      direction.sub(right);
    }
    if (
      this.inputManager.isKeyPressed('KeyD') ||
      this.inputManager.isKeyPressed('d') ||
      this.inputManager.isKeyPressed('D')
    ) {
      direction.add(right);
    }

    if (direction.length() > 0) {
      direction.normalize();
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
