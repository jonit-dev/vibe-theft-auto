import { IGameObject } from '@/core/interfaces/IGameObject';
import { Scene } from '@/core/Scene';
import { SceneManager } from '@/core/SceneManager';
import { EventBus } from '@modules/events/EventBus';
import { CollisionComponent } from '@modules/physics/components/CollisionComponent';
import { CollisionHandlerComponent } from '@modules/physics/components/CollisionHandlerComponent';
import * as THREE from 'three';
import { injectable } from 'tsyringe';

@injectable()
export class EventDemoScene extends Scene {
  private eventBus: EventBus;
  private sceneManager: SceneManager;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private backButton: THREE.Mesh | null = null;

  constructor(eventBus: EventBus, sceneManager: SceneManager) {
    super();
    this.eventBus = eventBus;
    this.sceneManager = sceneManager;
  }

  /**
   * Called when the scene is entered
   */
  onEnter(): void {
    console.log('Entering EventDemoScene');

    // Setup lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.getThreeScene().add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    this.getThreeScene().add(directionalLight);

    // Create back button
    this.createBackButton();

    // Create player
    const player = this.createGameObject('player');
    const playerMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x3333ff })
    );
    player.getObject3D().add(playerMesh);
    player.getObject3D().position.set(0, 0, 0);

    // Add collision component to player
    player.addComponent(CollisionComponent);

    // Add collision handler to player
    const playerCollisionHandler = player.addComponent(
      CollisionHandlerComponent
    );
    playerCollisionHandler.setCollisionHandler((objectA, objectB) => {
      console.log(
        `Player collided with ${
          objectA.getId() === 'player' ? objectB.getId() : objectA.getId()
        }`
      );
      // Make the player bounce back slightly
      const otherObject = objectA.getId() === 'player' ? objectB : objectA;
      const direction = new THREE.Vector3()
        .subVectors(
          player.getObject3D().position,
          otherObject.getObject3D().position
        )
        .normalize()
        .multiplyScalar(0.5);
      player.getObject3D().position.add(direction);
    });

    // Create several target objects
    for (let i = 0; i < 5; i++) {
      const target = this.createGameObject(`target-${i}`);
      const targetMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({ color: 0xff3333 })
      );
      target.getObject3D().add(targetMesh);

      // Position them in a circle around the player
      const angle = (i / 5) * Math.PI * 2;
      const radius = 5;
      target
        .getObject3D()
        .position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);

      // Add collision component to target
      target.addComponent(CollisionComponent);

      // Add collision handler to target
      const targetCollisionHandler = target.addComponent(
        CollisionHandlerComponent
      );
      targetCollisionHandler.setCollisionHandler((objectA, objectB) => {
        const thisTarget = target.getId();
        console.log(
          `Target ${thisTarget} collided with ${
            objectA.getId() === thisTarget ? objectB.getId() : objectA.getId()
          }`
        );

        // Change color when hit
        const mesh = target.getObject3D().children[0] as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;
        material.color.set(0x00ff00);

        // Schedule color reset after 1 second
        setTimeout(() => {
          material.color.set(0xff3333);
        }, 1000);
      });
    }

    // Listen for all collision events and log them globally
    this.eventBus.on(
      'collision',
      (objectA: IGameObject, objectB: IGameObject) => {
        console.log(
          `[Global listener] Collision between ${objectA.getId()} and ${objectB.getId()}`
        );
      }
    );

    // Add event listener for mouse clicks
    document.addEventListener('click', this.onMouseClick.bind(this));

    console.log(
      'EventDemoScene setup complete. The player moves in a figure-8 pattern and collides with targets.'
    );
  }

  /**
   * Called when the scene is exited
   */
  onExit(): void {
    // Clean up by clearing all event listeners
    this.eventBus.clear();
    document.removeEventListener('click', this.onMouseClick.bind(this));
  }

  /**
   * Update the scene
   */
  update(deltaTime: number): void {
    super.update(deltaTime);

    // Add simple movement to demonstrate collisions
    const player = this.getGameObject('player');
    if (player) {
      const time = performance.now() / 1000;

      // Make player move in a figure-8 pattern
      const x = Math.sin(time * 0.5) * 3;
      const z = Math.sin(time * 1.0) * 3;

      player.getObject3D().position.set(x, 0, z);
    }
  }

  /**
   * Create a back button to return to intro screen
   */
  private createBackButton(): void {
    // Create a canvas for the button
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = 256;
    canvas.height = 64;

    // Style the button
    context.fillStyle = '#2c3e50';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = '#e74c3c';
    context.lineWidth = 4;
    context.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
    context.font = 'Bold 24px Arial';
    context.fillStyle = '#ecf0f1';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('Back to Intro', canvas.width / 2, canvas.height / 2);

    // Create a texture from the canvas
    const texture = new THREE.CanvasTexture(canvas);

    // Create a plane with the texture
    this.backButton = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 0.5),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true })
    );

    // Position the button at the top-right corner
    this.backButton.position.set(6, 4, 0);
    this.getThreeScene().add(this.backButton);
  }

  /**
   * Handle mouse clicks
   */
  private onMouseClick(event: MouseEvent): void {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    const camera = this.getThreeScene().getObjectByName(
      'camera'
    ) as THREE.Camera;
    if (!camera) return;

    this.raycaster.setFromCamera(this.mouse, camera);

    // Check if back button was clicked
    if (this.backButton) {
      const intersects = this.raycaster.intersectObject(this.backButton);
      if (intersects.length > 0) {
        console.log('Back button clicked, returning to intro screen');
        this.sceneManager.switchScene('intro');
      }
    }
  }
}
