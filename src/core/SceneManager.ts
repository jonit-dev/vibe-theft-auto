import { IScene } from '@/core/interfaces/IScene';
import { EventBus } from '@modules/events/EventBus';
import { injectable, singleton } from 'tsyringe';

@injectable()
@singleton()
export class SceneManager {
  private scenes: Map<string, IScene> = new Map();
  private currentScene: IScene | null = null;

  constructor(private eventBus: EventBus) {
    // Listen for scene:switch events
    this.eventBus.on('scene:switch', (sceneName: string) => {
      this.switchScene(sceneName);
    });
  }

  public registerScene(name: string, scene: IScene): void {
    this.scenes.set(name, scene);
  }

  public switchScene(name: string): void {
    if (!this.scenes.has(name)) {
      console.error(`Scene ${name} not found`);
      return;
    }

    // Clean up current scene if exists
    if (this.currentScene) {
      this.currentScene.onExit();
    }

    // Set new scene
    this.currentScene = this.scenes.get(name)!;
    this.currentScene.onEnter();
  }

  public getCurrentScene(): IScene | null {
    return this.currentScene;
  }

  public update(deltaTime: number): void {
    if (this.currentScene) {
      this.currentScene.update(deltaTime);
    }
  }
}
