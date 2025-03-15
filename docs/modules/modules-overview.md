# Game Engine Modules Overview

This document provides an overview of the modular architecture of the game engine. The engine is divided into self-contained modules, each responsible for a specific subsystem.

## Module Structure

The engine is organized into the following modules:

- **Rendering**: Graphics rendering system (RenderService)
- **Resources**: Asset loading and management (ResourceManager, ResourceCache, and specialized loaders)
- **Input**: User input handling (keyboard, mouse, gamepad)
- **Physics**: Physics simulation and collision detection (CollisionComponent, CollisionHandlerComponent)
- **Audio**: Sound and music playback (planned)
- **Events**: Event system for communication between components (EventBus)
- **UI**: User interface management (UIService)

## Implementation Status

As of the current implementation, we have successfully migrated:

- ✅ **Resources module**: Complete with ResourceManager, ResourceCache, and loaders
- ✅ **Rendering module**: Includes the RenderService for scene rendering
- ✅ **Events module**: Provides the EventBus for component communication
- ✅ **Physics module**: Basic collision detection components
- ✅ **UI module**: Basic UI management service
- ⚠️ **Input module**: To be migrated
- ⚠️ **Audio module**: To be implemented

## Directory Organization

```
src/
└── modules/
    ├── rendering/   # Graphics rendering system
    │   └── RenderService.ts
    ├── resources/   # Asset loading and management
    │   ├── ResourceManager.ts
    │   ├── ResourceCache.ts
    │   └── loaders/
    │       ├── TextureLoader.ts
    │       ├── ModelLoader.ts
    │       ├── AudioLoader.ts
    │       └── JsonLoader.ts
    ├── events/      # Event communication system
    │   └── EventBus.ts
    ├── physics/     # Physics simulation
    │   └── components/
    │       ├── CollisionComponent.ts
    │       └── CollisionHandlerComponent.ts
    ├── ui/          # User interface
    │   └── UIService.ts
    ├── input/       # User input handling (planned)
    └── audio/       # Sound and music playback (planned)
```

## Module Guidelines

When working with modules:

1. Keep all related code within the module directory
2. Define clear interfaces for communication with other modules
3. Use dependency injection for cross-module dependencies
4. Minimize direct dependencies between modules

## Dependency Management

Modules communicate through well-defined interfaces and dependency injection. We use the following patterns:

1. Path aliases for clean imports (e.g., `@modules/events/EventBus`)
2. TSyringe for dependency injection
3. Event-based communication via the EventBus
4. Direct service injection for required dependencies

## Adding New Modules

To add a new module to the engine:

1. Create a new directory under `src/modules/`
2. Add the module documentation under `docs/modules/`
3. Register module services in the dependency injection container (setupContainer.ts)
4. Define clear interfaces for communication with other modules
5. Update import paths to use the module path alias
