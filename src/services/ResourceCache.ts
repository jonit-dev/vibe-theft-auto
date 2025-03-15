import { injectable, singleton } from 'tsyringe';
import {
  CachedResource,
  ResourceMetadata,
} from '../core/interfaces/ResourceInterfaces';
import { EventBus } from './EventBus';

/**
 * Cache for storing loaded resources with reference counting and metadata
 */
@injectable()
@singleton()
export class ResourceCache {
  /** Map of resource ID to cached resource */
  private resources: Map<string, CachedResource> = new Map();

  /** Maximum age in milliseconds before unused resources are considered for cleanup */
  private maxAge: number = 5 * 60 * 1000; // 5 minutes

  constructor(private eventBus: EventBus) {
    // Set up periodic cache cleanup
    setInterval(() => this.cleanupUnusedResources(), 60 * 1000); // Check every minute
  }

  /**
   * Get a resource from the cache
   * @param id Resource identifier
   * @returns The cached resource or null if not found
   */
  get<T>(id: string): T | null {
    const cachedResource = this.resources.get(id);
    if (!cachedResource) {
      return null;
    }

    // Update access time and reference count
    cachedResource.lastAccessed = Date.now();
    cachedResource.refCount++;

    return cachedResource.resource as T;
  }

  /**
   * Store a resource in the cache
   * @param id Resource identifier
   * @param resource The resource to cache
   * @param metadata Metadata about the resource
   */
  set(id: string, resource: any, metadata: ResourceMetadata): void {
    const cachedResource: CachedResource = {
      resource,
      metadata,
      refCount: 1,
      lastAccessed: Date.now(),
    };

    this.resources.set(id, cachedResource);
    this.eventBus.emit('resource:cached', { id, metadata });
  }

  /**
   * Check if a resource exists in the cache
   * @param id Resource identifier
   * @returns True if the resource exists in the cache
   */
  has(id: string): boolean {
    return this.resources.has(id);
  }

  /**
   * Remove a resource from the cache
   * @param id Resource identifier
   * @returns True if the resource was removed
   */
  remove(id: string): boolean {
    const cachedResource = this.resources.get(id);
    if (!cachedResource) {
      return false;
    }

    this.eventBus.emit('resource:removed', {
      id,
      type: cachedResource.metadata.type,
    });

    return this.resources.delete(id);
  }

  /**
   * Release a reference to a resource
   * @param id Resource identifier
   * @returns Updated reference count or -1 if resource not found
   */
  release(id: string): number {
    const cachedResource = this.resources.get(id);
    if (!cachedResource) {
      return -1;
    }

    cachedResource.refCount = Math.max(0, cachedResource.refCount - 1);
    return cachedResource.refCount;
  }

  /**
   * Get resources by tag
   * @param tag Tag to filter by
   * @returns Array of resource IDs with the specified tag
   */
  getByTag(tag: string): string[] {
    const result: string[] = [];

    this.resources.forEach((resource, id) => {
      if (resource.metadata.tags?.includes(tag)) {
        result.push(id);
      }
    });

    return result;
  }

  /**
   * Clear all resources from the cache
   */
  clear(): void {
    this.resources.clear();
    this.eventBus.emit('resource:clear');
  }

  /**
   * Clean up unused resources based on reference count and age
   */
  private cleanupUnusedResources(): void {
    const now = Date.now();

    this.resources.forEach((resource, id) => {
      // Skip persistent resources
      if (resource.metadata.persistent) {
        return;
      }

      // Remove resources with no references that haven't been accessed recently
      if (
        resource.refCount === 0 &&
        now - resource.lastAccessed > this.maxAge
      ) {
        this.remove(id);
      }
    });
  }
}
