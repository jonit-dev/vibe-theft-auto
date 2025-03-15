import { IResourceLoader } from '@core/interfaces/IResourceLoader';
import { injectable } from 'tsyringe';

/**
 * Loader for JSON resources
 */
@injectable()
export class JsonLoader implements IResourceLoader {
  readonly resourceType: string = 'json';

  /**
   * Load a JSON file from the specified URL
   * @param url The URL of the JSON file to load
   * @param options Optional loading configuration
   * @returns Promise that resolves with the parsed JSON data
   */
  async load(url: string, options: JsonOptions = {}): Promise<any> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Apply transformation function if provided
      if (options.transform) {
        return options.transform(data);
      }

      return data;
    } catch (error: unknown) {
      throw new Error(
        `Failed to load JSON: ${url}, ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * No explicit unloading needed for JSON objects
   * @param jsonData JSON data to unload
   */
  unload(jsonData: any): void {
    // JSON data doesn't need explicit disposal
  }
}

/**
 * Options for JSON loading and configuration
 */
export interface JsonOptions {
  /** Optional transform function to apply to the loaded data */
  transform?: (data: any) => any;
}
