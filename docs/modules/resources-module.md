# Resources Module

The Resources Module is responsible for loading, caching, and managing game assets such as 3D models, textures, sounds, and other game data.

## Purpose

This module provides a centralized system for:

- Asynchronous loading of game assets
- Efficient caching to prevent duplicate loading
- Resource reference counting and memory management
- Type-safe access to different resource types
- Loading progress tracking

## Components

### ResourceManager

The central service that coordinates resource loading, caching, and unloading:

```typescript
@injectable()
@singleton()
class ResourceManager {
  // Load a texture asynchronously
  async loadTexture(key: string, url: string): Promise<THREE.Texture>;

  // Load a 3D model asynchronously
  async loadModel(key: string, url: string): Promise<THREE.Group>;

  // Load other asset types...

  // Unload resources by key
  unload(key: string): void;

  // Check if a resource is loaded
  isLoaded(key: string): boolean;
}
```

### ResourceCache

Handles the storage and retrieval of loaded resources:

```typescript
@injectable()
@singleton()
class ResourceCache {
  // Store a resource in the cache
  set<T>(key: string, resource: T, type: ResourceType): void;

  // Get a resource from the cache
  get<T>(key: string, type: ResourceType): T | undefined;

  // Remove a resource from the cache
  remove(key: string): void;

  // Clear all resources of a specific type
  clearByType(type: ResourceType): void;
}
```

### Resource Loaders

Specialized loaders for different file types:

- **TextureLoader**: Loads image files as Three.js textures
- **ModelLoader**: Loads 3D model files (GLTF, OBJ, etc.)
- **AudioLoader**: Loads audio files
- **JSONLoader**: Loads JSON data files

## Usage Examples

```typescript
// In a game component
@injectable()
class PlayerFactory {
  constructor(private resourceManager: ResourceManager) {}

  async createPlayer(): Promise<GameObject> {
    // Load player model and textures
    const model = await this.resourceManager.loadModel(
      'player',
      'assets/models/player.glb'
    );
    const texture = await this.resourceManager.loadTexture(
      'player-diffuse',
      'assets/textures/player.png'
    );

    // Use the loaded resources...
  }
}
```

## Dependencies

- THREE.js for 3D asset types
- Event system for resource events (load started, progress, completed, error)

## Future Enhancements

- Asset bundles for grouped loading
- Preloading strategies for different game states
- Streaming large assets
- Asset versioning for updates
