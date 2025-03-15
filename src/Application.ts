import { Engine } from '@/core/Engine';
import { SceneManager } from '@/core/SceneManager';
import { EventDemoScene } from '@/scenes/EventDemoScene';
import { IntroScene } from '@/scenes/IntroScene';
import { MainScene } from '@/scenes/MainScene';
import { ResourceDemoScene } from '@/scenes/ResourceDemoScene';
import { injectable, singleton } from 'tsyringe';

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
    private mainScene: MainScene,
    private introScene: IntroScene,
    private eventDemoScene: EventDemoScene,
    private resourceDemoScene: ResourceDemoScene
  ) {
    this.initialize();
  }

  /**
   * Initialize the application by setting up scenes
   */
  private initialize(): void {
    // Register all scenes
    this.sceneManager.registerScene('main', this.mainScene);
    this.sceneManager.registerScene('intro', this.introScene);
    this.sceneManager.registerScene('eventDemo', this.eventDemoScene);
    this.sceneManager.registerScene('resource-demo', this.resourceDemoScene);

    // Start with the intro scene
    this.sceneManager.switchScene('intro');
  }

  /**
   * Start the application
   */
  public start(): void {
    // Start the engine
    this.engine.start();
    console.log('Application started!');
  }

  /**
   * Stop the application and clean up resources
   */
  public stop(): void {
    // Stop the engine
    if (this.engine && typeof this.engine.stop === 'function') {
      this.engine.stop();
    }
    console.log('Application stopped!');
  }
}
