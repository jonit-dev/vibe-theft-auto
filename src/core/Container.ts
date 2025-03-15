import { container } from 'tsyringe';
import { MainScene } from '../scenes/MainScene';
import { SceneManager } from './SceneManager';

/**
 * Simplified container setup with autoInjectable.
 * Only need to register scenes and handle manual connections.
 */
export function setupContainer(): void {
  // All dependencies with @autoInjectable will be resolved automatically
  // We only need to register scenes and maintain relationships manually

  // Resolve our core manager with explicit type
  const sceneManager = container.resolve<SceneManager>(SceneManager);

  // Create the main scene (dependencies will be auto-injected)
  const mainScene = container.resolve<MainScene>(MainScene);

  // Register the scene in the manager
  sceneManager.registerScene('main', mainScene);
  sceneManager.switchScene('main');
}
