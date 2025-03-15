import { injectable, singleton } from 'tsyringe';
import { ReactContainer } from '../components/ReactContainer';
import { SceneManager } from '../core/SceneManager';

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
