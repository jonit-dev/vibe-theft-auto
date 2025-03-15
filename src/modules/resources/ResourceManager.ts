import type { IResourceLoader } from '@core/interfaces/IResourceLoader';
import {
  LoadingProgress,
  ResourceMetadata,
  ResourceRequest,
} from '@core/interfaces/ResourceInterfaces';
import { EventBus } from '@modules/events/EventBus';
import { inject, injectable, singleton } from 'tsyringe';
import { ResourceCache } from './ResourceCache';

/**
 * Central manager for loading, caching, and handling game resources
 */
@injectable()
@singleton()
export class ResourceManager {
  /** Map of resource type to loader */
  private loaders: Map<string, IResourceLoader> = new Map();

  /** Map of resource identifier to loading promise */
  private loadingPromises: Map<string, Promise<any>> = new Map();

  /** Map of resource identifier to progress information */
  private progress: Map<string, LoadingProgress> = new Map();

  constructor(
    @inject(ResourceCache) public cache: ResourceCache,
    @inject(EventBus) private eventBus: EventBus,
    @inject('TextureLoader') textureLoader: IResourceLoader,
    @inject('ModelLoader') modelLoader: IResourceLoader,
    @inject('AudioLoader') audioLoader: IResourceLoader,
    @inject('JsonLoader') jsonLoader: IResourceLoader
  ) {
    // Register all loaders
    this.register(textureLoader);
    this.register(modelLoader);
    this.register(audioLoader);
    this.register(jsonLoader);

    this.eventBus.emit('resource:manager-initialized');
  }

  /**
   * Register a resource loader
   * @param loader The loader to register
   */
  register(loader: IResourceLoader): void {
    this.loaders.set(loader.resourceType, loader);
    this.eventBus.emit('resource:loader-registered', {
      type: loader.resourceType,
    });
  }

  /**
   * Load a resource
   * @param type Resource type
   * @param url Resource URL
   * @param options Optional loading configuration
   * @returns Promise resolving to the loaded resource
   */
  async load<T>(type: string, url: string, options: any = {}): Promise<T> {
    const resourceId = this.generateResourceId(type, url);

    // Check if resource is already cached
    if (this.cache.has(resourceId)) {
      const resource = this.cache.get<T>(resourceId);
      if (resource !== null) {
        return resource;
      }
    }

    // Check if resource is currently loading
    if (this.loadingPromises.has(resourceId)) {
      return this.loadingPromises.get(resourceId) as Promise<T>;
    }

    // Get the appropriate loader
    const loader = this.loaders.get(type);
    if (!loader) {
      throw new Error(`No loader registered for resource type: ${type}`);
    }

    // Set initial progress
    this.progress.set(resourceId, {
      resourceId,
      progress: 0,
      status: 'loading',
    });

    // Create and store loading promise
    const loadingPromise = (async () => {
      try {
        this.eventBus.emit('resource:loading', { id: resourceId, type, url });

        // Load the resource
        const resource = await loader.load(url, options);

        // Cache it
        const metadata: ResourceMetadata = {
          type,
          size: this.estimateResourceSize(resource),
          persistent: options?.persistent || false,
          tags: options?.tags || [],
        };

        this.cache.set(resourceId, resource, metadata);

        // Update progress
        this.progress.set(resourceId, {
          resourceId,
          progress: 1,
          status: 'complete',
        });

        this.eventBus.emit('resource:loaded', { id: resourceId, type, url });

        return resource as T;
      } catch (error) {
        // Update progress with error
        this.progress.set(resourceId, {
          resourceId,
          progress: 0,
          status: 'error',
          error: error as Error,
        });

        this.eventBus.emit('resource:error', {
          id: resourceId,
          type,
          url,
          error,
        });

        throw error;
      } finally {
        // Clean up
        this.loadingPromises.delete(resourceId);
      }
    })();

    this.loadingPromises.set(resourceId, loadingPromise);
    return loadingPromise;
  }

  /**
   * Preload a batch of resources
   * @param resources Array of resource requests to load
   * @param onProgress Optional callback for loading progress
   * @returns Promise that resolves when all resources are loaded
   */
  async preloadResources(
    resources: ResourceRequest[],
    onProgress?: (overall: number, details: LoadingProgress[]) => void
  ): Promise<void> {
    if (resources.length === 0) {
      return;
    }

    const tasks: Promise<any>[] = [];
    const resourceIds: string[] = [];

    // Start loading all resources
    for (const resource of resources) {
      const { type, url, options } = resource;
      const resourceId = this.generateResourceId(type, url);
      resourceIds.push(resourceId);

      tasks.push(this.load(type, url, options));
    }

    // Set up progress tracking if callback provided
    if (onProgress) {
      const trackProgress = () => {
        const progressDetails: LoadingProgress[] = resourceIds.map((id) => {
          return (
            this.progress.get(id) || {
              resourceId: id,
              progress: 0,
              status: 'loading' as const,
            }
          );
        });

        // Calculate overall progress
        const overallProgress =
          progressDetails.reduce((sum, detail) => sum + detail.progress, 0) /
          progressDetails.length;

        onProgress(overallProgress, progressDetails);
      };

      // Track progress every 100ms
      const intervalId = setInterval(trackProgress, 100);

      // Clean up interval when done
      Promise.all(tasks).finally(() => {
        clearInterval(intervalId);
        trackProgress(); // Final progress update
      });
    }

    // Wait for all resources to load
    await Promise.all(tasks);
  }

  /**
   * Unload a specific resource
   * @param resourceId Resource identifier
   * @returns True if the resource was unloaded
   */
  unload(resourceId: string): boolean {
    // Get resource from cache first
    const resource = this.cache.get(resourceId);
    if (!resource) {
      return false;
    }

    // Release reference
    const refCount = this.cache.release(resourceId);

    // If no more references, consider disposing the resource
    if (refCount === 0) {
      // We need to access the original cached resource to get the type
      // This implementation is a bit of a workaround since we don't have direct access to the CachedResource
      const parts = resourceId.split('://');
      if (parts.length > 0) {
        const type = parts[0]; // Extract type from the resource ID format 'type://url'
        const loader = this.loaders.get(type);
        if (loader) {
          // Dispose using appropriate loader
          loader.unload(resource);
        }
      }
    }

    return true;
  }

  /**
   * Unload resources by tag
   * @param tag Tag to filter resources by
   */
  unloadByTag(tag: string): void {
    const resourceIds = this.cache.getByTag(tag);
    resourceIds.forEach((id) => this.unload(id));
  }

  /**
   * Unload all non-persistent resources
   */
  unloadAll(): void {
    // TODO: Implement unloading all resources
    this.cache.clear();
  }

  /**
   * Generate a unique resource ID based on type and URL
   */
  private generateResourceId(type: string, url: string): string {
    return `${type}://${url}`;
  }

  /**
   * Estimate the size of a resource in bytes
   * This is a rough estimate as accurate memory measurement isn't always possible
   */
  private estimateResourceSize(resource: any): number {
    // Default size estimate
    let size = 1024; // 1KB default

    // TODO: Implement better size estimation based on resource type
    // For now, we'll just use simple approximations

    return size;
  }
}
