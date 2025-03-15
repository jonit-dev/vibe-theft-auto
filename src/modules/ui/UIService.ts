import { SceneManager } from '@core/SceneManager';
import { ReactContainer } from '@game-components/ReactContainer';
import { injectable, singleton } from 'tsyringe';

@injectable()
@singleton()
export class UIService {
  private reactContainer: ReactContainer;
  private sceneManager: SceneManager;

  constructor(reactContainer: ReactContainer, sceneManager: SceneManager) {
    this.reactContainer = reactContainer;
    this.sceneManager = sceneManager;
  }

  /**
   * Clean up the UI
   */
  public clearUI(): void {
    this.reactContainer.unmount();
  }
}
