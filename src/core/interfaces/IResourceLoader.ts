/**
 * Interface for resource loaders that can load specific types of assets
 */
export interface IResourceLoader {
  /**
   * The type of resource this loader handles (e.g., 'texture', 'model', 'audio')
   */
  readonly resourceType: string;

  /**
   * Load a resource from the specified URL
   * @param url The URL of the resource to load
   * @param options Optional configuration options for loading
   * @returns A promise that resolves with the loaded resource
   */
  load(url: string, options?: any): Promise<any>;

  /**
   * Unload and dispose of a resource
   * @param resource The resource to unload
   */
  unload(resource: any): void;
}
