import 'reflect-metadata'; // Required for TSyringe - MUST BE THE FIRST ONE

import { Application } from '@/Application';
import { Engine } from '@/core/Engine';
import { SceneManager } from '@/core/SceneManager';
import { EventDemoScene } from '@/scenes/EventDemoScene';
import { IntroScene } from '@/scenes/IntroScene';
import { MainScene } from '@/scenes/MainScene';
import { EventBus } from '@/services/EventBus';
import { RenderService } from '@/services/RenderService';
import { InputManager } from '@/utils/InputManager';

import { container } from 'tsyringe';

// Register all services with the container
container.registerSingleton(Engine);
container.registerSingleton(SceneManager);
container.registerSingleton(RenderService);
container.registerSingleton(InputManager);
container.registerSingleton(EventBus);

// Register all scenes
container.registerSingleton(MainScene);
container.registerSingleton(IntroScene);
container.registerSingleton(EventDemoScene);

// Register the application
container.registerSingleton(Application);

// Resolve and start the application
const app = container.resolve(Application);
app.start();

console.log('Application started!');
