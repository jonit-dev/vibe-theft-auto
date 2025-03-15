import { Scene } from '@/core/Scene';
import { SceneManager } from '@/core/SceneManager';
import { EntityBuilder } from '@modules/entities/EntityBuilder';
import { EventBus } from '@modules/events/EventBus';
import { RenderService } from '@modules/rendering/RenderService';
import { ResourceManager } from '@modules/resources/ResourceManager';
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
  private resourceManager: ResourceManager;
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
    resourceManager: ResourceManager,
    eventBus: EventBus
  ) {
    super();
    this.sceneManager = sceneManager;
    this.renderService = renderService;
    this.entityBuilder = entityBuilder;
    this.resourceManager = resourceManager;
    this.eventBus = eventBus;
  }

  /**
   * Called when entering the scene
   */
  public async onEnter(): Promise<void> {
    console.log('Entered entity demo scene');

    // Create UI elements
    this.createUI();

    // Create a scene background
    this.getThreeScene().background = new THREE.Color(0x111111);

    // Remove the grid and any other helpers that might be causing issues
    this.getThreeScene().traverse((child) => {
      if (
        child instanceof THREE.GridHelper ||
        child instanceof THREE.AxesHelper ||
        (child instanceof THREE.Mesh &&
          child.material &&
          child.material.wireframe &&
          child.geometry instanceof THREE.SphereGeometry)
      ) {
        if (child.parent) {
          child.parent.remove(child);
        }
      }
    });

    // Set up camera position first to prevent issues
    const camera = this.renderService.getCamera();
    camera.position.set(10, 7, 15);
    camera.lookAt(0, 1, 0);

    // Create terrain first so other objects can be positioned on it
    await this.createTerrain();

    // Add lights using EntityBuilder
    this.addLights();

    // Create entities
    await this.createTexturedCube();
    await this.createCarModel();
    await this.createSoundEntity();
    this.createWaypoints();

    // Add back button
    this.createBackButton();

    // Setup event listeners last to ensure everything is initialized
    document.addEventListener('click', this.onMouseClick.bind(this));

    // Override any camera controls that might reset the position
    const resetCamera = () => {
      camera.position.set(10, 7, 15);
      camera.lookAt(0, 1, 0);
    };

    // Apply camera reset multiple times to overcome any potential overrides
    setTimeout(resetCamera, 100);
    setTimeout(resetCamera, 500);
    setTimeout(resetCamera, 1000);
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

    // Stop any playing audio
    this.stopAudio();

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
      intensity: 0.6,
    });

    // Create directional light (sun)
    this.entityBuilder.createLightEntity({
      type: 'directional',
      color: 0xffffcc,
      intensity: 1.0,
      position: new THREE.Vector3(5, 8, 4),
      castShadow: true,
    });

    // Create a blue point light for accent
    this.entityBuilder.createLightEntity({
      type: 'point',
      color: 0x0066ff,
      intensity: 1.5,
      position: new THREE.Vector3(-4, 2, -2),
    });

    this.updateStatus('Added lights using EntityBuilder');
  }

  /**
   * Create terrain
   */
  private async createTerrain(): Promise<void> {
    try {
      // Use the dry riverbed rock texture
      const texturePath = 'assets/textures/terrain/dry_riverbed_rock.webp';

      // Create a simple flat terrain with the texture
      // Instead of using heightmap displacement which doesn't look good with this texture
      const planeGeometry = new THREE.PlaneGeometry(40, 40, 1, 1);
      const texture = new THREE.TextureLoader().load(texturePath);

      // Set texture to repeat for better scale
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(8, 8);

      const groundMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 1.0,
        metalness: 0.0,
      });

      const groundMesh = new THREE.Mesh(planeGeometry, groundMaterial);
      groundMesh.rotation.x = -Math.PI / 2; // Lay flat
      groundMesh.position.y = -0.5; // Slightly below origin
      groundMesh.receiveShadow = true;

      // Add to scene directly
      this.getThreeScene().add(groundMesh);

      // Create a GameObject to track this
      this.terrain = this.createGameObject('terrain-ground');
      this.terrain.getObject3D().add(new THREE.Object3D()); // Empty object for tracking

      this.updateStatus('Created terrain with dry riverbed rock texture');
    } catch (error) {
      console.error('Error creating terrain:', error);
      this.updateStatus(`Error creating terrain: ${error}`);
    }
  }

  /**
   * Create a textured cube
   */
  private async createTexturedCube(): Promise<void> {
    try {
      await this.entityBuilder.createTexturedCube({
        textureUrl: 'assets/textures/crate.webp',
        position: new THREE.Vector3(-5, 0.5, -3),
        size: 1.5,
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
        position: new THREE.Vector3(3, 0, 2),
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
   * Create sound entity
   */
  private async createSoundEntity(): Promise<void> {
    try {
      // Create a customized sound entity with better visualization
      const gameObject = this.createGameObject('sound-entity');
      const object3D = gameObject.getObject3D();

      // Position it in the scene
      object3D.position.set(-2, 0.5, -6);

      // Load audio
      const audioBuffer = await this.resourceManager.load<AudioBuffer>(
        'audio',
        'assets/audio/retrowave.mp3',
        { tags: ['entity-demo'] }
      );

      // Store audio data in the object for use with an audio component
      object3D.userData.audio = {
        buffer: audioBuffer,
        autoplay: true,
        loop: true,
        volume: 1,
        radius: 8,
      };

      // Create a more visible but non-intrusive speaker symbol
      const speakerGroup = new THREE.Group();

      // Main speaker body
      const speakerBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.4, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x333333 })
      );
      speakerGroup.add(speakerBody);

      // Speaker cone
      const coneMaterial = new THREE.MeshStandardMaterial({
        color: 0x22cc22,
        emissive: 0x116611,
        metalness: 0.5,
        roughness: 0.2,
      });
      const cone = new THREE.Mesh(
        new THREE.CircleGeometry(0.15, 16),
        coneMaterial
      );
      cone.position.z = 0.11;
      speakerGroup.add(cone);

      // Add some sound wave indicators (small rings)
      [0.3, 0.6, 0.9].forEach((radius) => {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(radius - 0.03, radius, 16),
          new THREE.MeshBasicMaterial({
            color: 0x22cc22,
            transparent: true,
            opacity: 0.5 - radius * 0.3, // fade out with distance
          })
        );
        ring.position.z = 0.12;
        speakerGroup.add(ring);
      });

      // Add the speaker to the object
      object3D.add(speakerGroup);

      // Actually play the sound using Web Audio API
      this.playAudio(audioBuffer);

      this.updateStatus(
        'Created sound entity with speaker visualization and started audio playback'
      );
    } catch (error) {
      console.error('Error creating sound entity:', error);
      this.updateStatus(`Error creating sound entity: ${error}`);
    }
  }

  /**
   * Play audio buffer using Web Audio API
   */
  private playAudio(buffer: AudioBuffer): void {
    try {
      // Create audio context
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // Create audio source from buffer
      const source = audioContext.createBufferSource();
      source.buffer = buffer;

      // Create gain node for volume control
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0.5; // Set volume to 50%

      // Connect nodes: source -> gain -> destination
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Set looping
      source.loop = true;

      // Start playback
      source.start(0);

      // Store references for cleanup
      this.getThreeScene().userData.audioContext = audioContext;
      this.getThreeScene().userData.audioSource = source;

      console.log('Started audio playback');
    } catch (error) {
      console.error('Error playing audio:', error);
      this.updateStatus(`Error playing audio: ${error}`);
    }
  }

  /**
   * Create waypoints
   */
  private createWaypoints(): void {
    // Create a more meaningful path of waypoints around the scene
    const waypointPositions = [
      new THREE.Vector3(-8, 0.5, 4),
      new THREE.Vector3(-4, 0.5, 8),
      new THREE.Vector3(1, 0.5, 10),
      new THREE.Vector3(6, 0.5, 8),
      new THREE.Vector3(9, 0.5, 4),
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

  /**
   * Stop any playing audio
   */
  private stopAudio(): void {
    try {
      const audioContext = this.getThreeScene().userData.audioContext;
      const audioSource = this.getThreeScene().userData.audioSource;

      if (audioSource) {
        audioSource.stop();
        audioSource.disconnect();
      }

      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }

      console.log('Stopped audio playback');
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  }
}
