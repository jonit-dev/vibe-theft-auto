import { Scene } from '@/core/Scene';
import { SceneManager } from '@/core/SceneManager';
import { ResourceRequest } from '@/core/interfaces/ResourceInterfaces';
import { AssetCreator } from '@/utils/AssetCreator';
import { EventBus } from '@modules/events/EventBus';
import { RenderService } from '@modules/rendering/RenderService';
import { ResourceManager } from '@modules/resources/ResourceManager';
import * as THREE from 'three';
import { injectable, singleton } from 'tsyringe';

/**
 * Demo scene showcasing the resource management system
 */
@injectable()
@singleton()
export class ResourceDemoScene extends Scene {
  private sceneManager: SceneManager;
  private renderService: RenderService;
  private resourceManager: ResourceManager;
  private eventBus: EventBus;

  // Track loaded resources for demonstration
  private loadedTexture: THREE.Texture | null = null;
  private loadedModel: THREE.Group | null = null;
  private loadedAudio: AudioBuffer | null = null;
  private loadedJson: any = null;
  private loadedRetrowaveAudio: AudioBuffer | null = null;

  // UI elements
  private progressBar: HTMLDivElement | null = null;
  private statusText: HTMLDivElement | null = null;
  private backButton: THREE.Mesh | null = null;

  // Mouse interaction
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  // Resources to load - we'll generate them programmatically
  private resources: ResourceRequest[] = [];

  // Track loaded car model
  private loadedCarModel: THREE.Group | null = null;

  constructor(
    sceneManager: SceneManager,
    renderService: RenderService,
    resourceManager: ResourceManager,
    eventBus: EventBus
  ) {
    super();
    this.sceneManager = sceneManager;
    this.renderService = renderService;
    this.resourceManager = resourceManager;
    this.eventBus = eventBus;

    // Subscribe to resource events for demonstration
    this.eventBus.on('resource:loading', this.onResourceLoading.bind(this));
    this.eventBus.on('resource:loaded', this.onResourceLoaded.bind(this));
    this.eventBus.on('resource:error', this.onResourceError.bind(this));
  }

  /**
   * Called when entering the scene
   */
  public onEnter(): void {
    console.log('Entered resource demo scene');

    // Setup basic scene environment
    this.setupScene();

    // Create UI elements
    this.createUI();

    // Setup event listeners
    document.addEventListener('click', this.onMouseClick.bind(this));

    // Generate placeholder assets and create resources array
    this.createDynamicResources();

    // Preload resources
    this.preloadResources();
  }

  /**
   * Called when exiting the scene
   */
  public onExit(): void {
    // Clean up event listeners
    document.removeEventListener('click', this.onMouseClick.bind(this));

    this.eventBus.off('resource:loading', this.onResourceLoading.bind(this));
    this.eventBus.off('resource:loaded', this.onResourceLoaded.bind(this));
    this.eventBus.off('resource:error', this.onResourceError.bind(this));

    // Remove UI elements
    if (this.progressBar) {
      document.body.removeChild(this.progressBar.parentElement!);
      this.progressBar = null;
    }

    if (this.statusText) {
      document.body.removeChild(this.statusText);
      this.statusText = null;
    }

    // Unload non-persistent resources
    this.resourceManager.unloadByTag('resource-demo');

    console.log('Exited resource demo scene, resources unloaded');
  }

  /**
   * Create dynamic resources instead of loading from disk
   */
  private createDynamicResources(): void {
    // Load the physical crate texture from the assets folder
    const textureLoader = new THREE.TextureLoader();
    const crateTexture = textureLoader.load('assets/textures/crate.webp');
    crateTexture.wrapS = THREE.RepeatWrapping;
    crateTexture.wrapT = THREE.RepeatWrapping;
    crateTexture.repeat.set(2, 2);

    // Register the texture with ResourceManager directly
    this.resourceManager.cache.set(
      'texture://dynamic/crate.jpg', // Keep the same ID for compatibility
      crateTexture,
      {
        type: 'texture',
        size: 512 * 512 * 4, // Rough size estimate
        persistent: false,
        tags: ['resource-demo'],
      }
    );

    // Create model
    const cubeModel = AssetCreator.createCubeModel();
    this.resourceManager.cache.set('model://dynamic/cube.glb', cubeModel, {
      type: 'model',
      size: 1024, // Rough size estimate
      persistent: false,
      tags: ['resource-demo'],
    });

    // Create audio
    const audioContext = new AudioContext();
    const audioBuffer = AssetCreator.createAudioBuffer(audioContext, 2, 440);
    this.resourceManager.cache.set('audio://dynamic/tone.mp3', audioBuffer, {
      type: 'audio',
      size: audioBuffer.length * 4, // Rough size estimate
      persistent: false,
      tags: ['resource-demo'],
    });

    // Create JSON config
    const jsonConfig = {
      name: 'Dynamic Resource Demo Scene',
      description: 'Dynamically created resources for demo',
      version: '1.0.0',
      settings: {
        lighting: {
          ambient: {
            color: '#404040',
            intensity: 0.5,
          },
        },
      },
    };
    this.resourceManager.cache.set('json://dynamic/config.json', jsonConfig, {
      type: 'json',
      size: JSON.stringify(jsonConfig).length,
      persistent: false,
      tags: ['resource-demo'],
    });

    // Set up resources to "load" (they'll come from cache)
    this.resources = [
      {
        type: 'texture',
        url: 'dynamic/crate.jpg',
        options: { tags: ['resource-demo'] },
      },
      {
        type: 'model',
        url: 'dynamic/cube.glb',
        options: { tags: ['resource-demo'] },
      },
      {
        type: 'audio',
        url: 'dynamic/tone.mp3',
        options: { tags: ['resource-demo'] },
      },
      {
        type: 'json',
        url: 'dynamic/config.json',
        options: { tags: ['resource-demo'] },
      },
      // Add the vice-city-car model
      {
        type: 'model',
        url: 'assets/models/vice-city-car.glb',
        options: { tags: ['resource-demo'] },
      },
      // Add retrowave audio
      {
        type: 'audio',
        url: 'assets/audio/retrowave.mp3',
        options: { tags: ['resource-demo'] },
      },
    ];
  }

  /**
   * Setup the scene with basic lighting and environment
   */
  private setupScene(): void {
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.getThreeScene().add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    this.getThreeScene().add(directionalLight);

    // Add a simple ground plane
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x999999,
      side: THREE.DoubleSide,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = Math.PI / 2;
    ground.position.y = -2;
    this.getThreeScene().add(ground);

    // Add back button
    this.createBackButton();
  }

  /**
   * Create UI elements for displaying resource loading progress
   */
  private createUI(): void {
    // Create container for progress bar
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '20px';
    container.style.left = '50%';
    container.style.transform = 'translateX(-50%)';
    container.style.width = '300px';
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    container.style.borderRadius = '5px';
    container.style.padding = '10px';

    // Create label
    const label = document.createElement('div');
    label.style.color = 'white';
    label.style.marginBottom = '5px';
    label.textContent = 'Resource Loading Progress:';
    container.appendChild(label);

    // Create progress bar background
    const progressBackground = document.createElement('div');
    progressBackground.style.width = '100%';
    progressBackground.style.height = '20px';
    progressBackground.style.backgroundColor = '#333';
    progressBackground.style.borderRadius = '3px';
    container.appendChild(progressBackground);

    // Create progress bar
    this.progressBar = document.createElement('div');
    this.progressBar.style.width = '0%';
    this.progressBar.style.height = '20px';
    this.progressBar.style.backgroundColor = '#4CAF50';
    this.progressBar.style.borderRadius = '3px';
    this.progressBar.style.transition = 'width 0.3s';
    progressBackground.appendChild(this.progressBar);

    // Create status text
    this.statusText = document.createElement('div');
    this.statusText.style.position = 'absolute';
    this.statusText.style.bottom = '20px';
    this.statusText.style.left = '20px';
    this.statusText.style.color = 'white';
    this.statusText.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    this.statusText.style.padding = '10px';
    this.statusText.style.borderRadius = '5px';
    this.statusText.style.maxWidth = '400px';
    this.statusText.style.maxHeight = '200px';
    this.statusText.style.overflowY = 'auto';
    this.statusText.innerHTML = '<h3>Resource Loading Status:</h3>';

    // Add to document
    document.body.appendChild(container);
    document.body.appendChild(this.statusText);
  }

  /**
   * Create a back button to return to main scene
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
   * Preload all resources needed for this scene
   */
  private async preloadResources(): Promise<void> {
    try {
      // Update status text
      this.updateStatus('Starting resource preload...');

      // Preload resources with progress tracking
      await this.resourceManager.preloadResources(
        this.resources,
        this.onLoadingProgress.bind(this)
      );

      // Once loading is complete, use the resources
      this.useLoadedResources();

      this.updateStatus('All resources loaded successfully!');
    } catch (error: unknown) {
      console.error('Error preloading resources:', error);
      this.updateStatus(
        `❌ Error preloading resources: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Callback for tracking loading progress
   */
  private onLoadingProgress(overall: number, details: any[]): void {
    // Update progress bar
    if (this.progressBar) {
      this.progressBar.style.width = `${overall * 100}%`;
    }

    // Get status of each resource
    const statuses = details
      .map((detail) => {
        return `${detail.resourceId}: ${Math.round(detail.progress * 100)}% (${
          detail.status
        })`;
      })
      .join('<br>');

    this.updateStatus(
      `Loading progress: ${Math.round(overall * 100)}%<br>${statuses}`
    );
  }

  /**
   * Use the loaded resources in the scene
   */
  private async useLoadedResources(): Promise<void> {
    try {
      // Load texture and create a cube with it
      this.loadedTexture = await this.resourceManager.load<THREE.Texture>(
        'texture',
        'dynamic/crate.jpg'
      );
      this.createTexturedCube(this.loadedTexture);

      // Load model and add it to the scene
      this.loadedModel = await this.resourceManager.load<THREE.Group>(
        'model',
        'dynamic/cube.glb'
      );
      if (this.loadedModel) {
        this.loadedModel.position.set(3, 0, 0);
        this.getThreeScene().add(this.loadedModel);
      }

      // Load and display the vice-city-car model
      this.loadedCarModel = await this.resourceManager.load<THREE.Group>(
        'model',
        'assets/models/vice-city-car.glb'
      );
      if (this.loadedCarModel) {
        this.loadedCarModel.position.set(0, 0, 3);
        this.loadedCarModel.scale.set(0.5, 0.5, 0.5); // Scale down if needed
        this.getThreeScene().add(this.loadedCarModel);
        this.updateStatus('🚗 Vice City Car model loaded successfully!');
      }

      // Load and play the generated audio tone
      this.loadedAudio = await this.resourceManager.load<AudioBuffer>(
        'audio',
        'dynamic/tone.mp3'
      );

      // Load and play retrowave audio
      this.loadedRetrowaveAudio = await this.resourceManager.load<AudioBuffer>(
        'audio',
        'assets/audio/retrowave.mp3'
      );
      this.playAudio(this.loadedRetrowaveAudio);
      this.updateStatus('🎵 Retrowave audio playing...');

      // Load JSON configuration
      this.loadedJson = await this.resourceManager.load<any>(
        'json',
        'dynamic/config.json'
      );
      console.log('Loaded scene configuration:', this.loadedJson);
    } catch (error: unknown) {
      console.error('Error using loaded resources:', error);
      this.updateStatus(
        `❌ Error using resources: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Play an audio buffer
   */
  private playAudio(buffer: AudioBuffer): void {
    try {
      const audioContext = new AudioContext();
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start();

      this.updateStatus('🔊 Playing audio sample...');
    } catch (error: unknown) {
      console.error('Error playing audio:', error);
    }
  }

  /**
   * Create a cube with the loaded texture
   */
  private createTexturedCube(texture: THREE.Texture): void {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(-3, 0, 0);

    // Add rotation animation
    const cubeObject = this.createGameObject('textured-cube');
    cubeObject.getObject3D().add(cube);
    cubeObject.getObject3D().position.copy(cube.position);

    // No direct Rotator usage here, just manually rotate in update
    this.getThreeScene().add(cube);
  }

  /**
   * Update status text
   */
  private updateStatus(message: string): void {
    if (this.statusText) {
      this.statusText.innerHTML = `<h3>Resource Loading Status:</h3>${message}`;
    }
  }

  /**
   * Handle resource loading event
   */
  private onResourceLoading(event: any): void {
    console.log(`Loading resource: ${event.id}`);
  }

  /**
   * Handle resource loaded event
   */
  private onResourceLoaded(event: any): void {
    console.log(`Resource loaded: ${event.id}`);
  }

  /**
   * Handle resource error event
   */
  private onResourceError(event: any): void {
    console.error(`Error loading resource: ${event.id}`, event.error);
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

    // Check for intersections
    if (this.backButton) {
      const intersects = this.raycaster.intersectObject(this.backButton);
      if (intersects.length > 0) {
        console.log('Back button clicked, returning to main scene');
        this.sceneManager.switchScene('main');
      }
    }
  }

  /**
   * Update function called every frame
   */
  public update(deltaTime: number): void {
    // Call parent update
    super.update(deltaTime);

    // Rotate any loaded models
    if (this.loadedModel) {
      this.loadedModel.rotation.y += deltaTime * 0.5;
    }

    // Rotate the car model
    if (this.loadedCarModel) {
      this.loadedCarModel.rotation.y += deltaTime * 0.3;
    }
  }
}
