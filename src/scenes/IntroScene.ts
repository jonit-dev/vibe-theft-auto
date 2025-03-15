import { ReactContainer } from '@/components/ReactContainer';
import { Scene } from '@/core/Scene';
import { SceneManager } from '@/core/SceneManager';
import { InputManager } from '@modules/input/InputManager';
import * as THREE from 'three';
import { injectable, singleton } from 'tsyringe';

@injectable()
@singleton()
export class IntroScene extends Scene {
  private sceneManager: SceneManager;
  private inputManager: InputManager;
  private reactContainer: ReactContainer | null = null;

  constructor(sceneManager: SceneManager, inputManager: InputManager) {
    super();
    this.sceneManager = sceneManager;
    this.inputManager = inputManager;
  }

  onEnter(): void {
    console.log('Entering IntroScene');

    // Setup lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.getThreeScene().add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    this.getThreeScene().add(directionalLight);

    // Initialize React container and render UI
    this.reactContainer = new ReactContainer();

    // Need to import dynamically to avoid JSX in TS file
    import('@/ui/IntroUI').then(({ IntroUI }) => {
      const React = require('react');
      this.reactContainer?.render(
        React.createElement(IntroUI, {
          onSceneSelect: this.switchScene.bind(this),
        })
      );
    });

    console.log('IntroScene setup complete. Click on a demo to start.');
  }

  onExit(): void {
    // Clean up React when leaving the scene
    if (this.reactContainer) {
      this.reactContainer.destroy();
      this.reactContainer = null;
    }
  }

  private switchScene(sceneName: string): void {
    console.log(`Switching to ${sceneName}`);
    this.sceneManager.switchScene(sceneName);
  }

  update(deltaTime: number): void {
    super.update(deltaTime);
    // No longer need to handle button hover effects, as React handles this
  }
}
