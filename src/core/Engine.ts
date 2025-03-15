import { autoInjectable, singleton } from 'tsyringe';
import { RenderService } from '../services/RenderService';
import { SceneManager } from './SceneManager';

@autoInjectable()
@singleton()
export class Engine {
  private running: boolean = false;
  private lastTime: number = 0;

  constructor(
    private renderService?: RenderService,
    private sceneManager?: SceneManager
  ) {}

  public start(): void {
    if (this.running) return;

    this.running = true;
    this.lastTime = performance.now();
    this.renderService?.initialize();
    this.renderLoop();
  }

  public stop(): void {
    this.running = false;
  }

  private renderLoop(): void {
    if (!this.running) return;

    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Update current scene
    this.sceneManager?.update(deltaTime);

    // Render the scene
    const currentScene = this.sceneManager?.getCurrentScene();
    if (currentScene && this.renderService) {
      this.renderService.render(currentScene);
    }

    // Request next frame
    requestAnimationFrame(() => this.renderLoop());
  }
}
