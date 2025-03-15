import { container } from 'tsyringe';
import { Application } from './Application';
import { ReactContainer } from './components/ReactContainer';
import { Engine } from './core/Engine';
import { SceneManager } from './core/SceneManager';
import { EventDemoScene } from './scenes/EventDemoScene';
import { IntroScene } from './scenes/IntroScene';
import { MainScene } from './scenes/MainScene';
import { ResourceDemoScene } from './scenes/ResourceDemoScene';
import { EventBus } from './services/EventBus';
import { RenderService } from './services/RenderService';
import { UIService } from './services/UIService';
import { InputManager } from './utils/InputManager';
// Import resource management components
import { IResourceLoader } from './core/interfaces/IResourceLoader';
import { ResourceCache } from './services/ResourceCache';
import { ResourceManager } from './services/ResourceManager';
import {
  AudioLoader,
  JsonLoader,
  ModelLoader,
  TextureLoader,
} from './services/loaders';

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

  // Register resource management services
  container.registerSingleton(ResourceCache);
  container.registerSingleton(ResourceManager);

  // Register resource loaders
  container.registerSingleton(TextureLoader);
  container.registerSingleton(ModelLoader);
  container.registerSingleton(AudioLoader);
  container.registerSingleton(JsonLoader);

  // Register loaders as IResourceLoader implementations
  container.register<IResourceLoader>('TextureLoader', {
    useToken: TextureLoader,
  });
  container.register<IResourceLoader>('ModelLoader', { useToken: ModelLoader });
  container.register<IResourceLoader>('AudioLoader', { useToken: AudioLoader });
  container.register<IResourceLoader>('JsonLoader', { useToken: JsonLoader });

  // Register all scenes
  container.registerSingleton(MainScene);
  container.registerSingleton(IntroScene);
  container.registerSingleton(EventDemoScene);
  container.registerSingleton(ResourceDemoScene);

  // Register the application
  container.registerSingleton(Application);

  return container;
}
