import { IResourceLoader } from '@core/interfaces/IResourceLoader';
import * as THREE from 'three';
import { injectable } from 'tsyringe';

/**
 * Loader for texture resources
 */
@injectable()
export class TextureLoader implements IResourceLoader {
  readonly resourceType: string = 'texture';

  private loader: THREE.TextureLoader;

  constructor() {
    this.loader = new THREE.TextureLoader();
  }

  /**
   * Load a texture from the specified URL
   * @param url The URL of the texture to load
   * @param options Texture options (wrap, repeat, etc.)
   * @returns Promise that resolves with the loaded texture
   */
  async load(
    url: string,
    options: TextureOptions = {}
  ): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (texture) => {
          // Apply options to the loaded texture
          this.applyTextureOptions(texture, options);
          resolve(texture);
        },
        undefined, // onProgress is not supported by TextureLoader
        (error) => {
          reject(
            new Error(
              `Failed to load texture: ${url}, ${
                error instanceof Error ? error.message : String(error)
              }`
            )
          );
        }
      );
    });
  }

  /**
   * Dispose of a texture
   * @param texture Texture to dispose
   */
  unload(texture: THREE.Texture): void {
    if (texture && texture.dispose) {
      texture.dispose();
    }
  }

  /**
   * Apply options to a texture
   * @param texture The texture to configure
   * @param options Configuration options
   */
  private applyTextureOptions(
    texture: THREE.Texture,
    options: TextureOptions
  ): void {
    if (options.wrapS !== undefined) {
      texture.wrapS = options.wrapS;
    }

    if (options.wrapT !== undefined) {
      texture.wrapT = options.wrapT;
    }

    if (options.repeat) {
      texture.repeat.set(options.repeat.x || 1, options.repeat.y || 1);
    }

    if (options.offset) {
      texture.offset.set(options.offset.x || 0, options.offset.y || 0);
    }

    if (options.anisotropy !== undefined) {
      texture.anisotropy = options.anisotropy;
    }

    if (options.colorSpace !== undefined) {
      texture.colorSpace = options.colorSpace;
    }

    if (options.flipY !== undefined) {
      texture.flipY = options.flipY;
    }

    // Need to set this flag if any parameters were changed
    texture.needsUpdate = true;
  }
}

/**
 * Options for texture loading and configuration
 */
export interface TextureOptions {
  /** Horizontal wrapping mode */
  wrapS?: THREE.Wrapping;

  /** Vertical wrapping mode */
  wrapT?: THREE.Wrapping;

  /** Texture repeat */
  repeat?: { x?: number; y?: number };

  /** Texture offset */
  offset?: { x?: number; y?: number };

  /** Anisotropy level */
  anisotropy?: number;

  /** Color space (replaces encoding in newer Three.js versions) */
  colorSpace?: THREE.ColorSpace;

  /** Whether to flip the texture on Y axis */
  flipY?: boolean;
}
