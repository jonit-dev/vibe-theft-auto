import { container } from 'tsyringe';
import { Application } from './Application';
import { ReactContainer } from './components/ReactContainer';
import { Engine } from './core/Engine';
import { SceneManager } from './core/SceneManager';
import { EventDemoScene } from './scenes/EventDemoScene';
import { IntroScene } from './scenes/IntroScene';
import { MainScene } from './scenes/MainScene';
import { EventBus } from './services/EventBus';
import { RenderService } from './services/RenderService';
import { UIService } from './services/UIService';
import { InputManager } from './utils/InputManager';

// Configure the dependency injection container
export function setupContainer() {
  // Register all services with the container
  container.registerSingleton(Engine);
  container.registerSingleton(SceneManager);
  container.registerSingleton(RenderService);
  container.registerSingleton(InputManager);
  container.registerSingleton(EventBus);
  container.registerSingleton(ReactContainer);
  container.registerSingleton(UIService);

  // Register all scenes
  container.registerSingleton(MainScene);
  container.registerSingleton(IntroScene);
  container.registerSingleton(EventDemoScene);

  // Register the application
  container.registerSingleton(Application);

  return container;
}
