import { autoInjectable, singleton } from 'tsyringe';
import { BaseScene } from '../scenes/BaseScene';

@autoInjectable()
@singleton()
export class SceneManager {
  private scenes: Map<string, BaseScene> = new Map();
  private currentScene: BaseScene | null = null;

  public registerScene(name: string, scene: BaseScene): void {
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

  public getCurrentScene(): BaseScene | null {
    return this.currentScene;
  }

  public update(deltaTime: number): void {
    if (this.currentScene) {
      this.currentScene.update(deltaTime);
    }
  }
}
