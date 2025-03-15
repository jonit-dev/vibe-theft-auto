import { injectable, singleton } from 'tsyringe';
import { Scene } from './Scene';

@injectable()
@singleton()
export class SceneManager {
  private scenes: Map<string, Scene> = new Map();
  private currentScene: Scene | null = null;

  constructor() {
    // Empty constructor
  }

  public registerScene(name: string, scene: Scene): void {
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

  public getCurrentScene(): Scene | null {
    return this.currentScene;
  }

  public update(deltaTime: number): void {
    if (this.currentScene) {
      this.currentScene.update(deltaTime);
    }
  }
}
