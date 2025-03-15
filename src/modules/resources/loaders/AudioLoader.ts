import { IResourceLoader } from '@core/interfaces/IResourceLoader';
import * as THREE from 'three';
import { injectable } from 'tsyringe';

/**
 * Loader for audio resources
 */
@injectable()
export class AudioLoader implements IResourceLoader {
  readonly resourceType: string = 'audio';

  private loader: THREE.AudioLoader;

  constructor() {
    this.loader = new THREE.AudioLoader();
  }

  /**
   * Load an audio file from the specified URL
   * @param url The URL of the audio file to load
   * @param options Audio loading options
   * @returns Promise that resolves with the loaded audio buffer
   */
  async load(url: string, options: AudioOptions = {}): Promise<AudioBuffer> {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (buffer) => {
          resolve(buffer);
        },
        (progress) => {
          // Progress callback (not used currently)
        },
        (error) => {
          reject(
            new Error(
              `Failed to load audio: ${url}, ${
                error instanceof Error ? error.message : String(error)
              }`
            )
          );
        }
      );
    });
  }

  /**
   * No explicit unloading needed for audio buffers as they are handled by garbage collection
   * @param audioBuffer Audio buffer to unload
   */
  unload(audioBuffer: AudioBuffer): void {
    // Audio buffers don't have explicit dispose methods
    // They are garbage collected when no longer referenced
  }
}

/**
 * Options for audio loading and configuration
 */
export interface AudioOptions {
  /** Volume level (0 to 1) */
  volume?: number;

  /** Whether the audio should loop */
  loop?: boolean;
}
