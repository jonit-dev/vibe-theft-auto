# Resource Management Demo

This document explains how to use the Resource Management demo scene that showcases the game engine's resource loading capabilities.

## Running the Demo

1. Start the application
2. Click the "Resource Demo" button in the main scene
3. The Resource Demo Scene will load and begin preloading resources
4. Watch the progress bar and status text to see the loading progress
5. Once loaded, the resources will be used in the scene

## Features Demonstrated

### 1. Resource Preloading

The demo shows how to preload multiple resources at once with progress tracking. This is useful for loading all assets needed for a level before entering it.

```typescript
// Preload multiple resources with progress tracking
await resourceManager.preloadResources(resources, (overall, details) => {
  // Update progress UI based on loading state
  console.log(`Overall progress: ${overall * 100}%`);
});
```

### 2. Resource Caching

All loaded resources are automatically cached. Subsequent requests for the same resource will return the cached version without reloading.

```typescript
// First load will fetch the resource
const texture1 = await resourceManager.load('texture', 'textures/crate.jpg');

// Second load will return the cached resource immediately
const texture2 = await resourceManager.load('texture', 'textures/crate.jpg');
```

### 3. Different Resource Types

The demo loads several different types of resources:

- **Textures**: Used for materials
- **3D Models**: GLTF/GLB models
- **Audio**: Sound effects and music
- **JSON**: Configuration and data files

### 4. Resource Tagging

Resources can be tagged for easier group operations:

```typescript
// Tag resources during loading
await resourceManager.load('texture', 'textures/level1.jpg', {
  tags: ['level-1', 'environment'],
});

// Later, unload all resources with a specific tag
resourceManager.unloadByTag('level-1');
```

### 5. Reference Counting

The resource manager tracks how many parts of the application are using each resource. Resources are only truly unloaded when nothing is referencing them anymore.

### 6. Memory Management

Unused resources can be automatically cleaned up after a certain time period to free memory.

## Code Structure

The resource management system consists of:

1. **ResourceManager**: Central manager for loading and tracking resources
2. **ResourceCache**: Stores loaded resources with reference counting
3. **Resource Loaders**: Specialized loaders for different asset types:
   - TextureLoader
   - ModelLoader
   - AudioLoader
   - JsonLoader

## Implementation Details

For this demo, resources are generated programmatically rather than loaded from disk:

- Textures are created using HTML Canvas
- Models are created using Three.js geometry
- Audio is synthesized using Web Audio API
- JSON is created in memory

In a real application, these would typically be loaded from files on disk or from a server.

## Best Practices

1. **Preload level assets**: Load all required assets before starting a level
2. **Use tags for organization**: Tag resources by level, type, or usage
3. **Release when done**: Call `unload()` when you're done with a resource
4. **Mark persistent resources**: Flag frequently used resources as persistent
5. **Monitor memory usage**: Watch for memory leaks from resources not being properly released
