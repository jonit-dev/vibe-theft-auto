import { injectable, singleton } from 'tsyringe';
import { Engine } from './core/Engine';
import { SceneManager } from './core/SceneManager';
import { MainScene } from './scenes/MainScene';

/**
 * Main application class that wires everything together.
 * This eliminates the need for a separate container setup.
 */
@injectable()
@singleton()
export class Application {
  constructor(
    private engine: Engine,
    private sceneManager: SceneManager,
    private mainScene: MainScene
  ) {
    this.initialize();
  }

  /**
   * Initialize the application by setting up scenes
   */
  private initialize(): void {
    // Register and switch to main scene
    this.sceneManager.registerScene('main', this.mainScene);
    this.sceneManager.switchScene('main');
  }

  /**
   * Start the application
   */
  public start(): void {
    // Start the engine
    this.engine.start();
    console.log('Application started!');
  }
}
