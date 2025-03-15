import { SceneManager } from '@/core/SceneManager';
import { CameraService } from '@modules/camera';
import { InputManager } from '@modules/input/InputManager';
import { RenderService } from '@modules/rendering/RenderService';
import { injectable, singleton } from 'tsyringe';

@injectable()
@singleton()
export class Engine {
  private running: boolean = false;
  private lastTime: number = 0;

  constructor(
    private renderService: RenderService,
    private sceneManager: SceneManager,
    private inputManager: InputManager,
    private cameraService: CameraService
  ) {}

  public start(): void {
    if (this.running) return;

    this.running = true;
    this.lastTime = performance.now();
    this.renderService.initialize();
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

    // Update camera service
    this.cameraService.update(deltaTime);

    // Update current scene
    this.sceneManager.update(deltaTime);

    // Render the scene
    const currentScene = this.sceneManager.getCurrentScene();
    if (currentScene) {
      // Use the active camera from the camera service
      const camera = this.cameraService.getThreeCamera();
      if (camera) {
        this.renderService.render(currentScene, camera);
      } else {
        this.renderService.render(currentScene);
      }
    }

    // Update input state at the end of the frame
    this.inputManager.update();

    // Request next frame
    requestAnimationFrame(() => this.renderLoop());
  }
}
