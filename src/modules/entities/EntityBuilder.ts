import { GameObject } from '@/core/GameObject';
import { IScene } from '@/core/interfaces/IScene';
import { SceneManager } from '@/core/SceneManager';
import { ResourceManager } from '@modules/resources/ResourceManager';
import * as THREE from 'three';
import { injectable, singleton } from 'tsyringe';

/**
 * EntityBuilder provides a higher-level abstraction for creating game entities
 * with automatic resource management and simplified component attachment.
 *
 * It acts as a factory for creating common game entities with proper resource loading.
 */
@injectable()
@singleton()
export class EntityBuilder {
  constructor(
    private resourceManager: ResourceManager,
    private sceneManager: SceneManager
  ) {}

  /**
   * Create a simple entity with a textured cube
   */
  async createTexturedCube(options: {
    textureUrl: string;
    position?: THREE.Vector3;
    rotation?: THREE.Euler;
    scale?: THREE.Vector3;
    size?: number;
    name?: string;
    tags?: string[];
  }): Promise<GameObject> {
    const {
      textureUrl,
      position = new THREE.Vector3(0, 0, 0),
      rotation = new THREE.Euler(0, 0, 0),
      scale = new THREE.Vector3(1, 1, 1),
      size = 1,
      name = 'textured-cube',
      tags = [],
    } = options;

    // Get current scene
    const currentScene = this.sceneManager.getCurrentScene();
    if (!currentScene) {
      throw new Error('No active scene available to create entity');
    }

    // Create game object
    const gameObject = currentScene.createGameObject(name) as GameObject;

    // Load texture
    const texture = await this.resourceManager.load<THREE.Texture>(
      'texture',
      textureUrl
    );

    // Create cube with texture
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const cube = new THREE.Mesh(geometry, material);

    // Add to game object
    const object3D = gameObject.getObject3D();
    object3D.add(cube);

    // Set transform
    object3D.position.copy(position);
    object3D.rotation.copy(rotation);
    object3D.scale.copy(scale);

    // Tag the entity if needed for resource management
    if (tags.length > 0) {
      // Store tags in userData for later reference
      object3D.userData.resourceTags = tags;
    }

    return gameObject;
  }

  /**
   * Create an entity from a 3D model
   */
  async createModelEntity(options: {
    modelUrl: string;
    position?: THREE.Vector3;
    rotation?: THREE.Euler;
    scale?: THREE.Vector3;
    name?: string;
    tags?: string[];
  }): Promise<GameObject> {
    const {
      modelUrl,
      position = new THREE.Vector3(0, 0, 0),
      rotation = new THREE.Euler(0, 0, 0),
      scale = new THREE.Vector3(1, 1, 1),
      name = 'model-entity',
      tags = [],
    } = options;

    // Get current scene
    const currentScene = this.sceneManager.getCurrentScene();
    if (!currentScene) {
      throw new Error('No active scene available to create entity');
    }

    // Create game object
    const gameObject = currentScene.createGameObject(name) as GameObject;

    // Load model
    const model = await this.resourceManager.load<THREE.Group>(
      'model',
      modelUrl,
      {
        tags: tags,
      }
    );

    // Clone the model to avoid issues with instancing the same model multiple times
    const modelInstance = model.clone();

    // Add to game object
    const object3D = gameObject.getObject3D();
    object3D.add(modelInstance);

    // Set transform
    object3D.position.copy(position);
    object3D.rotation.copy(rotation);
    object3D.scale.copy(scale);

    // Store tags in userData for later reference
    if (tags.length > 0) {
      object3D.userData.resourceTags = tags;
    }

    return gameObject;
  }

  /**
   * Create a terrain entity from a heightmap
   */
  async createTerrain(options: {
    heightmapUrl: string;
    diffuseTextureUrl?: string;
    normalMapUrl?: string;
    width?: number;
    height?: number;
    depth?: number;
    segmentsX?: number;
    segmentsY?: number;
    position?: THREE.Vector3;
    name?: string;
    tags?: string[];
  }): Promise<GameObject> {
    const {
      heightmapUrl,
      diffuseTextureUrl,
      normalMapUrl,
      width = 100,
      height = 20,
      depth = 100,
      segmentsX = 128,
      segmentsY = 128,
      position = new THREE.Vector3(0, 0, 0),
      name = 'terrain',
      tags = [],
    } = options;

    // Get current scene
    const currentScene = this.sceneManager.getCurrentScene();
    if (!currentScene) {
      throw new Error('No active scene available to create entity');
    }

    // Create game object
    const gameObject = currentScene.createGameObject(name) as GameObject;

    // Load heightmap texture
    const heightmap = await this.resourceManager.load<THREE.Texture>(
      'texture',
      heightmapUrl,
      {
        tags: tags,
      }
    );

    // Create placeholder material
    let material = new THREE.MeshStandardMaterial({
      color: 0x3c3c3c,
      wireframe: false,
      flatShading: false,
    });

    // Load additional textures if provided
    if (diffuseTextureUrl) {
      const diffuseTexture = await this.resourceManager.load<THREE.Texture>(
        'texture',
        diffuseTextureUrl,
        {
          tags: tags,
        }
      );

      material.map = diffuseTexture;
      diffuseTexture.wrapS = THREE.RepeatWrapping;
      diffuseTexture.wrapT = THREE.RepeatWrapping;
      diffuseTexture.repeat.set(4, 4);
    }

    if (normalMapUrl) {
      const normalMap = await this.resourceManager.load<THREE.Texture>(
        'texture',
        normalMapUrl,
        {
          tags: tags,
        }
      );

      material.normalMap = normalMap;
      normalMap.wrapS = THREE.RepeatWrapping;
      normalMap.wrapT = THREE.RepeatWrapping;
      normalMap.repeat.set(4, 4);
    }

    // Create terrain geometry
    const geometry = new THREE.PlaneGeometry(
      width,
      depth,
      segmentsX,
      segmentsY
    );

    // Displace vertices based on heightmap
    // Note: In a real implementation, you'd use a shader or more sophisticated approach
    // This is just a simplified example
    const displaceMesh = () => {
      // Create a canvas to read heightmap data
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = heightmap.image.width;
      canvas.height = heightmap.image.height;

      ctx.drawImage(heightmap.image, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Apply height displacement
      const vertices = geometry.attributes.position.array;
      for (let i = 0; i < vertices.length / 3; i++) {
        const x = i % (segmentsX + 1);
        const y = Math.floor(i / (segmentsX + 1));

        // Sample heightmap
        const sampledX = Math.floor((x / (segmentsX + 1)) * canvas.width);
        const sampledY = Math.floor((y / (segmentsY + 1)) * canvas.height);

        const pixelIndex = (sampledY * canvas.width + sampledX) * 4;
        // Use red channel for height (you could use all channels for more precision)
        const terrainHeight = height || 20; // Default to 20 if height is undefined
        const displacement = (data[pixelIndex] / 255) * terrainHeight;

        // Apply height to vertex
        vertices[i * 3 + 1] = displacement;
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();
    };

    // Wait for the heightmap image to load
    if (heightmap.image) {
      displaceMesh();
    } else {
      // Use a safer approach with a custom loading check
      const checkImageLoaded = () => {
        if (heightmap.image) {
          displaceMesh();
          return true;
        }
        return false;
      };

      // Try immediately in case image loads quickly
      if (!checkImageLoaded()) {
        // Set up a small interval to check when the image is loaded
        // This avoids issues with event listener compatibility
        const loadCheckInterval = setInterval(() => {
          if (checkImageLoaded()) {
            clearInterval(loadCheckInterval);
          }
        }, 100);

        // Clear interval after a timeout to prevent infinite checking
        setTimeout(() => clearInterval(loadCheckInterval), 10000);
      }
    }

    // Create the terrain mesh
    const terrain = new THREE.Mesh(geometry, material);
    terrain.rotation.x = -Math.PI / 2; // Rotate to be horizontal

    // Add to game object
    const object3D = gameObject.getObject3D();
    object3D.add(terrain);
    object3D.position.copy(position);

    // Store tags in userData
    if (tags.length > 0) {
      object3D.userData.resourceTags = tags;
    }

    return gameObject;
  }

  /**
   * Create a sound entity (spatial audio source)
   */
  async createSoundEntity(options: {
    audioUrl: string;
    position?: THREE.Vector3;
    autoplay?: boolean;
    loop?: boolean;
    volume?: number;
    radius?: number;
    name?: string;
    tags?: string[];
  }): Promise<GameObject> {
    const {
      audioUrl,
      position = new THREE.Vector3(0, 0, 0),
      autoplay = false,
      loop = false,
      volume = 1,
      radius = 10,
      name = 'sound-entity',
      tags = [],
    } = options;

    // Get current scene
    const currentScene = this.sceneManager.getCurrentScene();
    if (!currentScene) {
      throw new Error('No active scene available to create entity');
    }

    // Create game object
    const gameObject = currentScene.createGameObject(name) as GameObject;

    // Load audio
    const audioBuffer = await this.resourceManager.load<AudioBuffer>(
      'audio',
      audioUrl,
      {
        tags: tags,
      }
    );

    // Store audio data in the object for use with an audio component
    const object3D = gameObject.getObject3D();
    object3D.userData.audio = {
      buffer: audioBuffer,
      autoplay,
      loop,
      volume,
      radius,
    };

    // Set position
    object3D.position.copy(position);

    // Add a visible indicator for the sound source in the scene
    const indicatorGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const indicatorMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
    object3D.add(indicator);

    // Visualize the radius
    const radiusGeometry = new THREE.SphereGeometry(radius, 16, 16);
    const radiusMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.1,
      wireframe: true,
    });
    const radiusVisualizer = new THREE.Mesh(radiusGeometry, radiusMaterial);
    object3D.add(radiusVisualizer);

    return gameObject;
  }

  /**
   * Create a light entity
   */
  createLightEntity(options: {
    type: 'ambient' | 'directional' | 'point' | 'spot';
    color?: THREE.ColorRepresentation;
    intensity?: number;
    position?: THREE.Vector3;
    target?: THREE.Vector3;
    castShadow?: boolean;
    name?: string;
  }): GameObject {
    const {
      type,
      color = 0xffffff,
      intensity = 1,
      position = new THREE.Vector3(0, 5, 0),
      target,
      castShadow = false,
      name = `${type}-light`,
    } = options;

    // Get current scene
    const currentScene = this.sceneManager.getCurrentScene();
    if (!currentScene) {
      throw new Error('No active scene available to create entity');
    }

    // Create game object
    const gameObject = currentScene.createGameObject(name) as GameObject;
    const object3D = gameObject.getObject3D();

    // Create the appropriate light type
    let light: THREE.Light;

    switch (type) {
      case 'ambient':
        light = new THREE.AmbientLight(color, intensity);
        break;

      case 'directional':
        light = new THREE.DirectionalLight(color, intensity);
        if (castShadow) {
          light.castShadow = true;
          (light as THREE.DirectionalLight).shadow.mapSize.width = 1024;
          (light as THREE.DirectionalLight).shadow.mapSize.height = 1024;
        }
        if (target) {
          (light as THREE.DirectionalLight).target.position.copy(target);
          object3D.add((light as THREE.DirectionalLight).target);
        }
        break;

      case 'point':
        light = new THREE.PointLight(color, intensity);
        if (castShadow) {
          light.castShadow = true;
          (light as THREE.PointLight).shadow.mapSize.width = 1024;
          (light as THREE.PointLight).shadow.mapSize.height = 1024;
        }
        break;

      case 'spot':
        light = new THREE.SpotLight(color, intensity);
        if (castShadow) {
          light.castShadow = true;
          (light as THREE.SpotLight).shadow.mapSize.width = 1024;
          (light as THREE.SpotLight).shadow.mapSize.height = 1024;
        }
        if (target) {
          (light as THREE.SpotLight).target.position.copy(target);
          object3D.add((light as THREE.SpotLight).target);
        }
        break;

      default:
        throw new Error(`Unsupported light type: ${type}`);
    }

    // Add the light to the object
    object3D.add(light);
    object3D.position.copy(position);

    // Add a helper to visualize the light (except for ambient)
    if (type !== 'ambient') {
      let helper: THREE.Object3D;

      switch (type) {
        case 'directional':
          helper = new THREE.DirectionalLightHelper(
            light as THREE.DirectionalLight,
            1
          );
          break;
        case 'point':
          helper = new THREE.PointLightHelper(light as THREE.PointLight, 0.5);
          break;
        case 'spot':
          helper = new THREE.SpotLightHelper(light as THREE.SpotLight);
          break;
        default:
          helper = new THREE.Object3D(); // Empty helper
      }

      object3D.add(helper);
    }

    return gameObject;
  }

  /**
   * Create a simple waypoint entity
   */
  createWaypoint(options: {
    position: THREE.Vector3;
    color?: THREE.ColorRepresentation;
    size?: number;
    name?: string;
    label?: string;
  }): GameObject {
    const {
      position,
      color = 0xffff00,
      size = 0.5,
      name = 'waypoint',
      label,
    } = options;

    // Get current scene
    const currentScene = this.sceneManager.getCurrentScene();
    if (!currentScene) {
      throw new Error('No active scene available to create entity');
    }

    // Create game object
    const gameObject = currentScene.createGameObject(name) as GameObject;
    const object3D = gameObject.getObject3D();

    // Create a waypoint marker
    const markerGeometry = new THREE.SphereGeometry(size, 16, 16);
    const markerMaterial = new THREE.MeshBasicMaterial({ color });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);

    // Add a ring around the waypoint
    const ringGeometry = new THREE.RingGeometry(size * 1.2, size * 1.4, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;

    // Add to object
    object3D.add(marker);
    object3D.add(ring);
    object3D.position.copy(position);

    // Add label if specified
    if (label) {
      // Create a canvas for the text
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = 256;
        canvas.height = 64;

        // Draw text
        context.fillStyle = 'rgba(0, 0, 0, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = 'Bold 24px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(label, canvas.width / 2, canvas.height / 2);

        // Create a texture and sprite
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.y = size * 2;
        sprite.scale.set(2, 0.5, 1);

        object3D.add(sprite);
      }
    }

    return gameObject;
  }

  /**
   * Register a prefab (template) for later instantiation
   */
  registerPrefab(
    name: string,
    createFn: (scene: IScene) => Promise<GameObject> | GameObject
  ): void {
    // TODO: Implement prefab registration system
    console.log(`Prefab registration for ${name} is not yet implemented`);
  }

  /**
   * Create an entity from a registered prefab
   */
  async createFromPrefab(name: string, options: any = {}): Promise<GameObject> {
    // TODO: Implement prefab instantiation system
    console.log(`Prefab instantiation for ${name} is not yet implemented`);

    // Placeholder - return an empty game object
    const currentScene = this.sceneManager.getCurrentScene();
    if (!currentScene) {
      throw new Error('No active scene available to create entity');
    }

    return currentScene.createGameObject(`prefab-${name}`) as GameObject;
  }
}
