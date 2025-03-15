import { Scene } from '@/core/Scene';
import { SceneManager } from '@/core/SceneManager';
import { EventBus } from '@/services/EventBus';
import { RenderService } from '@/services/RenderService';
import { EntityBuilder } from '@/utils/EntityBuilder';
import * as THREE from 'three';
import { injectable, singleton } from 'tsyringe';

/**
 * Demo scene showcasing the EntityBuilder system
 */
@injectable()
@singleton()
export class EntityDemoScene extends Scene {
  private sceneManager: SceneManager;
  private renderService: RenderService;
  private entityBuilder: EntityBuilder;
  private eventBus: EventBus;

  // Keep track of game objects for updating
  private car: any = null;
  private terrain: any = null;
  private waypoints: any[] = [];

  // UI elements
  private statusText: HTMLDivElement | null = null;
  private backButton: THREE.Mesh | null = null;

  // Mouse interaction
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  constructor(
    sceneManager: SceneManager,
    renderService: RenderService,
    entityBuilder: EntityBuilder,
    eventBus: EventBus
  ) {
    super();
    this.sceneManager = sceneManager;
    this.renderService = renderService;
    this.entityBuilder = entityBuilder;
    this.eventBus = eventBus;
  }

  /**
   * Called when entering the scene
   */
  public async onEnter(): Promise<void> {
    console.log('Entered entity demo scene');

    // Create UI elements
    this.createUI();

    // Setup event listeners
    document.addEventListener('click', this.onMouseClick.bind(this));

    // Set up camera position
    this.renderService.getCamera().position.set(0, 10, 20);
    this.renderService.getCamera().lookAt(0, 0, 0);

    // Add lights using EntityBuilder
    this.addLights();

    // Create a simple textured cube
    await this.createTexturedCube();

    // Create car model
    await this.createCarModel();

    // Create terrain
    await this.createTerrain();

    // Create sound entity
    await this.createSoundEntity();

    // Create waypoints
    this.createWaypoints();

    // Add back button
    this.createBackButton();
  }

  /**
   * Called when exiting the scene
   */
  public onExit(): void {
    // Clean up event listeners
    document.removeEventListener('click', this.onMouseClick.bind(this));

    // Remove UI elements
    if (this.statusText) {
      document.body.removeChild(this.statusText);
      this.statusText = null;
    }

    // Clear all entities
    this.clearAllEntities();

    console.log('Exited entity demo scene');
  }

  /**
   * Create UI elements
   */
  private createUI(): void {
    // Create status text
    this.statusText = document.createElement('div');
    this.statusText.style.position = 'absolute';
    this.statusText.style.top = '20px';
    this.statusText.style.left = '20px';
    this.statusText.style.color = 'white';
    this.statusText.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    this.statusText.style.padding = '10px';
    this.statusText.style.borderRadius = '5px';
    this.statusText.style.maxWidth = '400px';
    this.statusText.innerHTML =
      '<h3>Entity Builder Demo</h3>' +
      '<p>This scene demonstrates the EntityBuilder abstraction over ResourceManager.</p>';

    document.body.appendChild(this.statusText);
  }

  /**
   * Add lights to the scene
   */
  private addLights(): void {
    // Create ambient light
    this.entityBuilder.createLightEntity({
      type: 'ambient',
      color: 0x404040,
      intensity: 0.5,
    });

    // Create directional light (sun)
    this.entityBuilder.createLightEntity({
      type: 'directional',
      color: 0xffffff,
      intensity: 0.8,
      position: new THREE.Vector3(10, 10, 10),
      castShadow: true,
    });

    // Create a point light
    this.entityBuilder.createLightEntity({
      type: 'point',
      color: 0x2288ff,
      intensity: 1,
      position: new THREE.Vector3(-5, 3, 0),
    });

    this.updateStatus('Added lights using EntityBuilder');
  }

  /**
   * Create a textured cube
   */
  private async createTexturedCube(): Promise<void> {
    try {
      await this.entityBuilder.createTexturedCube({
        textureUrl: 'assets/textures/crate.webp',
        position: new THREE.Vector3(-5, 0, 0),
        size: 2,
        tags: ['entity-demo'],
      });

      this.updateStatus('Created textured cube with new crate texture');
    } catch (error) {
      console.error('Error creating textured cube:', error);
      this.updateStatus(`Error creating textured cube: ${error}`);
    }
  }

  /**
   * Create car model
   */
  private async createCarModel(): Promise<void> {
    try {
      this.car = await this.entityBuilder.createModelEntity({
        modelUrl: 'assets/models/vice-city-car.glb',
        position: new THREE.Vector3(0, 0, 0),
        scale: new THREE.Vector3(0.5, 0.5, 0.5),
        name: 'demo-car',
        tags: ['entity-demo'],
      });

      this.updateStatus('Created car model using EntityBuilder');
    } catch (error) {
      console.error('Error creating car model:', error);
      this.updateStatus(`Error creating car model: ${error}`);
    }
  }

  /**
   * Create terrain
   */
  private async createTerrain(): Promise<void> {
    try {
      // Use the dry riverbed rock texture as both the diffuse texture and heightmap
      const texturePath = 'assets/textures/terrain/dry_riverbed_rock.webp';

      this.terrain = await this.entityBuilder.createTerrain({
        heightmapUrl: texturePath, // Use the same texture as a heightmap
        diffuseTextureUrl: texturePath,
        width: 50,
        height: 3, // Reduce the height to make terrain displacement less extreme
        depth: 50,
        position: new THREE.Vector3(0, -2, 0),
        tags: ['entity-demo'],
      });

      this.updateStatus('Created terrain with dry riverbed rock texture');
    } catch (error) {
      console.error('Error creating terrain:', error);
      this.updateStatus(`Error creating terrain: ${error}`);
    }
  }

  /**
   * Create sound entity
   */
  private async createSoundEntity(): Promise<void> {
    try {
      await this.entityBuilder.createSoundEntity({
        audioUrl: 'assets/audio/retrowave.mp3',
        position: new THREE.Vector3(5, 0, 5),
        autoplay: true,
        loop: true,
        radius: 15,
        tags: ['entity-demo'],
      });

      this.updateStatus('Created sound entity using EntityBuilder');
    } catch (error) {
      console.error('Error creating sound entity:', error);
      this.updateStatus(`Error creating sound entity: ${error}`);
    }
  }

  /**
   * Create waypoints
   */
  private createWaypoints(): void {
    // Create a path of waypoints
    const waypointPositions = [
      new THREE.Vector3(-10, 0, -10),
      new THREE.Vector3(-5, 0, -8),
      new THREE.Vector3(0, 0, -5),
      new THREE.Vector3(5, 0, -8),
      new THREE.Vector3(10, 0, -10),
    ];

    waypointPositions.forEach((position, index) => {
      const waypoint = this.entityBuilder.createWaypoint({
        position,
        color: 0x00ffff,
        size: 0.3,
        name: `waypoint-${index}`,
        label: `Point ${index + 1}`,
      });

      this.waypoints.push(waypoint);
    });

    this.updateStatus('Created waypoints using EntityBuilder');
  }

  /**
   * Create back button to return to main scene
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
    context.strokeStyle = '#3498db';
    context.lineWidth = 4;
    context.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
    context.font = 'Bold 24px Arial';
    context.fillStyle = '#ecf0f1';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('Back to Main', canvas.width / 2, canvas.height / 2);

    // Create a texture from the canvas
    const texture = new THREE.CanvasTexture(canvas);

    // Create a plane with the texture
    this.backButton = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 0.5),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true })
    );

    // Position the button
    this.backButton.position.set(6, 4, 0);
    this.getThreeScene().add(this.backButton);
  }

  /**
   * Handle mouse clicks (for back button)
   */
  private onMouseClick(event: MouseEvent): void {
    // Calculate mouse position in normalized device coordinates
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(this.mouse, this.renderService.getCamera());

    // Check for intersections with back button
    if (this.backButton) {
      const intersects = this.raycaster.intersectObject(this.backButton);
      if (intersects.length > 0) {
        console.log('Back button clicked, returning to main scene');
        this.sceneManager.switchScene('main');
      }
    }
  }

  /**
   * Update status text
   */
  private updateStatus(message: string): void {
    if (this.statusText) {
      this.statusText.innerHTML += `<p>${message}</p>`;
    }
  }

  /**
   * Clear all entities from the scene
   */
  private clearAllEntities(): void {
    // Get all game objects with the 'entity-demo' tag
    // In a more complete implementation, you'd have a proper way to
    // track and clean up entities by tag
    this.getAllGameObjects().forEach((gameObject) => {
      gameObject.destroy();
    });
  }

  /**
   * Update function called every frame
   */
  public update(deltaTime: number): void {
    // Call parent update
    super.update(deltaTime);

    // Rotate the car model if available
    if (this.car) {
      this.car.getObject3D().rotation.y += deltaTime * 0.5;
    }

    // Update waypoints (make them float up and down)
    this.waypoints.forEach((waypoint, index) => {
      const object = waypoint.getObject3D();
      object.position.y =
        Math.sin(performance.now() * 0.001 + index) * 0.2 + 0.5;
    });
  }
}
