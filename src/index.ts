import 'reflect-metadata'; // Required for TSyringe
import { container } from 'tsyringe';
import { setupContainer } from './core/Container';
import { Engine } from './core/Engine';

// Initialize dependency injection container
setupContainer();

// Resolve and start the engine (it has auto-injected dependencies)
const engine = container.resolve(Engine);
engine.start();

console.log('Application started!');
