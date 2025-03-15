import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { injectable } from 'tsyringe';
import { IResourceLoader } from '../../core/interfaces/IResourceLoader';

/**
 * Loader for 3D model resources
 */
@injectable()
export class ModelLoader implements IResourceLoader {
  readonly resourceType: string = 'model';

  private gltfLoader: GLTFLoader;

  constructor() {
    this.gltfLoader = new GLTFLoader();
  }

  /**
   * Load a 3D model from the specified URL
   * @param url The URL of the model to load
   * @param options Model loading options
   * @returns Promise that resolves with the loaded model
   */
  async load(url: string, options: ModelOptions = {}): Promise<THREE.Group> {
    try {
      let loader: any;
      const fileExtension = this.getFileExtension(url).toLowerCase();

      // Choose loader based on file extension
      if (fileExtension === 'glb' || fileExtension === 'gltf') {
        return this.loadGLTF(url, options);
      } else {
        throw new Error(`Unsupported model format: ${fileExtension}`);
      }
    } catch (error: unknown) {
      throw new Error(
        `Failed to load model: ${url}, ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Dispose of a model
   * @param model Model to dispose
   */
  unload(model: THREE.Group): void {
    if (!model) return;

    // Recursively dispose of all geometries and materials
    model.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        if (object.geometry && object.geometry.dispose) {
          object.geometry.dispose();
        }

        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) =>
              this.disposeMaterial(material)
            );
          } else {
            this.disposeMaterial(object.material);
          }
        }
      }
    });
  }

  /**
   * Load a GLTF/GLB model
   * @param url URL of the GLTF/GLB model
   * @param options Loading options
   * @returns Promise resolving to the loaded model
   */
  private async loadGLTF(
    url: string,
    options: ModelOptions
  ): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf: GLTF) => {
          const model = gltf.scene;

          // Apply options
          this.applyModelOptions(model, options);

          // Extract animations if present
          if (gltf.animations && gltf.animations.length > 0) {
            (model as any).animations = gltf.animations;
          }

          resolve(model);
        },
        (progress) => {
          // Progress callback (not used currently)
        },
        (error) => {
          reject(
            new Error(
              `Failed to load GLTF/GLB model: ${url}, ${
                error instanceof Error ? error.message : String(error)
              }`
            )
          );
        }
      );
    });
  }

  /**
   * Apply options to a loaded model
   * @param model The model to configure
   * @param options Configuration options
   */
  private applyModelOptions(model: THREE.Group, options: ModelOptions): void {
    // Apply scale if specified
    if (options.scale !== undefined) {
      if (typeof options.scale === 'number') {
        model.scale.set(options.scale, options.scale, options.scale);
      } else {
        model.scale.set(
          options.scale.x || 1,
          options.scale.y || 1,
          options.scale.z || 1
        );
      }
    }

    // Apply position if specified
    if (options.position) {
      model.position.set(
        options.position.x || 0,
        options.position.y || 0,
        options.position.z || 0
      );
    }

    // Apply rotation if specified
    if (options.rotation) {
      model.rotation.set(
        options.rotation.x || 0,
        options.rotation.y || 0,
        options.rotation.z || 0
      );
    }

    // Apply material settings if needed
    if (options.materialOptions) {
      model.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          this.applyMaterialOptions(object, options.materialOptions);
        }
      });
    }
  }

  /**
   * Apply material options to a mesh
   * @param mesh The mesh to modify
   * @param options Material options
   */
  private applyMaterialOptions(
    mesh: THREE.Mesh,
    options?: MaterialOptions
  ): void {
    if (!options) return;

    const materials = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material];

    materials.forEach((material) => {
      // Apply material settings
      if (options.castShadow !== undefined) {
        mesh.castShadow = options.castShadow;
      }

      if (options.receiveShadow !== undefined) {
        mesh.receiveShadow = options.receiveShadow;
      }

      // More material options can be added here
    });
  }

  /**
   * Dispose of a material and its textures
   * @param material Material to dispose
   */
  private disposeMaterial(material: THREE.Material): void {
    if (!material) return;

    // Dispose textures
    for (const propertyName in material) {
      const property = (material as any)[propertyName];
      if (property instanceof THREE.Texture) {
        property.dispose();
      }
    }

    // Dispose material
    if (material.dispose) {
      material.dispose();
    }
  }

  /**
   * Get the file extension from a URL
   * @param url URL to parse
   * @returns File extension
   */
  private getFileExtension(url: string): string {
    const splitUrl = url.split('.');
    return splitUrl[splitUrl.length - 1];
  }
}

/**
 * Options for model loading and configuration
 */
export interface ModelOptions {
  /** Scale factor (uniform or per-axis) */
  scale?: number | { x?: number; y?: number; z?: number };

  /** Position coordinates */
  position?: { x?: number; y?: number; z?: number };

  /** Rotation in radians */
  rotation?: { x?: number; y?: number; z?: number };

  /** Material configuration options */
  materialOptions?: MaterialOptions;
}

/**
 * Options for material configuration
 */
export interface MaterialOptions {
  /** Whether the model casts shadows */
  castShadow?: boolean;

  /** Whether the model receives shadows */
  receiveShadow?: boolean;
}
