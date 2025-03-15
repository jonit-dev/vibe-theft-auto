/**
 * Metadata for a cached resource
 */
export interface ResourceMetadata {
  /** The type of the resource (e.g., 'texture', 'model', 'audio') */
  type: string;

  /** Estimated size of the resource in bytes */
  size: number;

  /** Whether the resource should persist in cache even when unused */
  persistent: boolean;

  /** Optional tags for grouping and batch operations */
  tags?: string[];
}

/**
 * Interface for a cached resource
 */
export interface CachedResource {
  /** The loaded resource */
  resource: any;

  /** Metadata about the resource */
  metadata: ResourceMetadata;

  /** Reference count for this resource */
  refCount: number;

  /** Timestamp when the resource was last accessed */
  lastAccessed: number;
}

/**
 * Interface for resource requests in batch loading
 */
export interface ResourceRequest {
  /** Type of resource to load */
  type: string;

  /** URL of the resource */
  url: string;

  /** Optional configuration for loading */
  options?: any;
}

/**
 * Interface for tracking loading progress
 */
export interface LoadingProgress {
  /** Identifier for the resource */
  resourceId: string;

  /** Progress value from 0 to 1 */
  progress: number;

  /** Current status of loading */
  status: 'loading' | 'complete' | 'error';

  /** Error object if status is 'error' */
  error?: Error;
}
