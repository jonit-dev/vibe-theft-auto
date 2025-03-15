# Game Engine Folder Restructuring

## Restructuring Overview

The game engine codebase has undergone a significant restructuring to improve organization, maintainability, and code discoverability. The primary change was moving from a service-oriented architecture with flat directories to a modular architecture with domain-specific modules.

## Changes Made

1. Created a new `modules` directory structure
2. Migrated services to domain-specific modules:
   - Resources module (ResourceManager, ResourceCache, loaders)
   - Rendering module (RenderService)
   - Events module (EventBus)
   - Physics module (collision components)
   - UI module (UIService)
   - Input module (InputManager)
   - Entities module (EntityBuilder)
3. Reorganized utility functions into appropriate modules:
   - Moved InputManager from utils to modules/input
   - Moved EntityBuilder from utils to modules/entities
   - Moved AssetCreator from utils to modules/resources/generators
4. Added path aliases for improved imports
5. Updated import paths throughout the codebase

## Benefits of This Restructuring

- **Better Organization**: Domain-specific code is now grouped together
- **Improved Discoverability**: Easier to find related files
- **Clearer Architecture**: The modular design is reflected in the directory structure
- **Reduced Coupling**: Domain boundaries are more clearly defined
- **Better Extensibility**: New features can be added in relevant modules
- **Simplified Onboarding**: New developers can understand the architecture from the file structure

## Path Aliases

To simplify import statements and make the code more maintainable, we've added the following path aliases:

```javascript
// In webpack.config.cjs and tsconfig.json
{
  '@modules': 'src/modules',
}
```

This allows imports like:

```typescript
import { EventBus } from '@modules/events/EventBus';
import { RenderService } from '@modules/rendering/RenderService';
import { ResourceManager } from '@modules/resources/ResourceManager';
```

## Current Directory Structure

The source code is now organized as follows:

```
src/
├── core/                    # Core engine components
│   ├── Component.ts
│   ├── Engine.ts
│   ├── GameObject.ts
│   ├── Scene.ts
│   ├── SceneManager.ts
│   └── interfaces/
│
├── modules/                 # Domain-specific modules
│   ├── rendering/           # Graphics rendering
│   │   └── RenderService.ts
│   │
│   ├── resources/           # Resource management
│   │   ├── ResourceManager.ts
│   │   ├── ResourceCache.ts
│   │   ├── generators/      # Asset creation utilities
│   │   │   └── AssetCreator.ts
│   │   └── loaders/
│   │       ├── TextureLoader.ts
│   │       ├── ModelLoader.ts
│   │       ├── AudioLoader.ts
│   │       └── JsonLoader.ts
│   │
│   ├── events/              # Event system
│   │   └── EventBus.ts
│   │
│   ├── physics/             # Physics and collision
│   │   └── components/
│   │       ├── CollisionComponent.ts
│   │       └── CollisionHandlerComponent.ts
│   │
│   ├── ui/                  # User interface
│   │   └── UIService.ts
│   │
│   ├── input/               # Input handling
│   │   └── InputManager.ts
│   │
│   └── entities/            # Entity creation and management
│       └── EntityBuilder.ts
│
├── scenes/                  # Game scenes
├── utils/                   # General utility functions
└── components/              # Game-specific components
```

## Future Improvements

- Create a proper audio module with audio playback functionality
- Move additional domain-specific components to their relevant modules
- Add more interfaces for module boundaries
- Continue refining the utils directory for truly generic utilities

## Migration Scripts

The following scripts were created to help with the migration:

- `scripts/migrate-to-modules.sh` - Script to create the module directories and copy files
- `scripts/cleanup-services.sh` - Script to remove the original files after successful migration

These scripts can be used as reference for future migrations or to understand the migration process.
