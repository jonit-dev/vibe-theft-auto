# Entities Module

The Entities Module provides high-level abstractions for creating and managing game entities in the engine.

## Purpose

This module is responsible for:

- Providing factory methods for creating common game entities
- Managing resource loading for entities
- Offering a prefab system for reusable game objects
- Simplifying the creation of complex entity hierarchies
- Handling entity templates and instances

## Components

### EntityBuilder

The central factory service for creating game entities:

```typescript
@injectable()
@singleton()
export class EntityBuilder {
  // Create a textured cube
  async createTexturedCube(options: {
    textureUrl: string;
    position?: THREE.Vector3;
    rotation?: THREE.Euler;
    scale?: THREE.Vector3;
    size?: number;
    name?: string;
    tags?: string[];
  }): Promise<GameObject>;

  // Create an entity from a 3D model
  async createModelEntity(options: {
    modelUrl: string;
    position?: THREE.Vector3;
    rotation?: THREE.Euler;
    scale?: THREE.Vector3;
    name?: string;
    tags?: string[];
  }): Promise<GameObject>;

  // Create a terrain from a heightmap
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
  }): Promise<GameObject>;

  // Create a sound-emitting entity
  async createSoundEntity(options: {
    audioUrl: string;
    position?: THREE.Vector3;
    autoplay?: boolean;
    loop?: boolean;
    volume?: number;
    radius?: number;
    name?: string;
    tags?: string[];
  }): Promise<GameObject>;

  // Create a light entity
  createLightEntity(options: {
    type: 'ambient' | 'directional' | 'point' | 'spot';
    color?: THREE.ColorRepresentation;
    intensity?: number;
    position?: THREE.Vector3;
    target?: THREE.Vector3;
    castShadow?: boolean;
    name?: string;
  }): GameObject;

  // Create a waypoint marker
  createWaypoint(options: {
    position: THREE.Vector3;
    color?: THREE.ColorRepresentation;
    size?: number;
    name?: string;
    label?: string;
  }): GameObject;

  // Register a prefab for later use
  registerPrefab(
    name: string,
    createFn: (scene: IScene) => Promise<GameObject> | GameObject
  ): void;

  // Create an entity from a prefab
  async createFromPrefab(name: string, options: any): Promise<GameObject>;
}
```

## Usage Examples

```typescript
// Creating basic entities
@injectable()
class GameWorld {
  constructor(private entityBuilder: EntityBuilder, private scene: IScene) {}

  async createLevel(): Promise<void> {
    // Create terrain
    const terrain = await this.entityBuilder.createTerrain({
      heightmapUrl: 'assets/heightmaps/level1.png',
      width: 500,
      height: 50,
      depth: 500,
      position: new THREE.Vector3(0, -25, 0),
    });

    // Add objects on the terrain
    const tree = await this.entityBuilder.createModelEntity({
      modelUrl: 'assets/models/tree.glb',
      position: new THREE.Vector3(10, 0, 20),
      scale: new THREE.Vector3(2, 2, 2),
    });

    // Add lighting
    this.entityBuilder.createLightEntity({
      type: 'directional',
      color: 0xffffff,
      intensity: 1,
      position: new THREE.Vector3(50, 100, 50),
      castShadow: true,
    });

    // Register a prefab for reuse
    this.entityBuilder.registerPrefab('enemy', async (scene) => {
      const enemy = await this.entityBuilder.createModelEntity({
        modelUrl: 'assets/models/enemy.glb',
      });

      // Add components to the enemy
      enemy.addComponent(AIController);
      enemy.addComponent(HealthComponent).setHealth(100);

      return enemy;
    });

    // Create instances from the prefab
    const enemy1 = await this.entityBuilder.createFromPrefab('enemy', {
      position: new THREE.Vector3(20, 0, 30),
    });

    const enemy2 = await this.entityBuilder.createFromPrefab('enemy', {
      position: new THREE.Vector3(-10, 0, 15),
    });
  }
}
```

## Dependencies

- Core module for GameObject and Scene classes
- Resources module for loading assets
- THREE.js for 3D object creation

## Future Enhancements

- Entity pooling for performance optimization
- More sophisticated prefab system with inheritance
- Entity serialization and deserialization
- Visual editor integration for entity creation
- Blueprint system for complex entity relationships
