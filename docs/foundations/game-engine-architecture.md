# ThreeJS Basic Game Engine Architecture

## Current Architecture Overview

The current architecture implements a foundational 3D game engine using Three.js with a clean, component-based design. The system follows these key architectural patterns:

- **Dependency Injection** via TSyringe for service management
- **Component Pattern** similar to Unity for game object composition
- **Scene-based** organization for game state management
- **Service-oriented** design for cross-cutting concerns

### Core Architecture Diagram

```mermaid
classDiagram
    class Engine {
        -running: boolean
        -lastTime: number
        +start(): void
        +stop(): void
        -renderLoop(): void
    }

    class SceneManager {
        -scenes: Map
        -currentScene: IScene
        +registerScene(name, scene): void
        +switchScene(name): void
        +getCurrentScene(): IScene
        +update(deltaTime): void
    }

    class Scene {
        -scene: THREE.Scene
        -gameObjects: Map
        +onEnter(): void
        +onExit(): void
        +update(deltaTime): void
        +createGameObject(id): GameObject
    }

    class GameObject {
        -id: string
        -object3D: THREE.Object3D
        -components: Component[]
        -active: boolean
        +addComponent<T>(componentType): T
        +getComponent<T>(componentType): T
        +update(deltaTime): void
    }

    class Component {
        #gameObject: IGameObject
        -enabled: boolean
        #start(): void
        +update(deltaTime): void
        +destroy(): void
    }

    class RenderService {
        -renderer: THREE.WebGLRenderer
        -camera: THREE.PerspectiveCamera
        +initialize(): void
        +render(scene): void
    }

    class InputManager {
        -keys: Map
        -mousePosition: object
        +isKeyPressed(key): boolean
        +getMousePosition(): object
        +update(): void
    }

    Engine --> SceneManager: uses
    Engine --> RenderService: uses
    Engine --> InputManager: uses
    SceneManager --> Scene: manages
    Scene --> GameObject: contains
    GameObject --> Component: has many
```

### Game Loop Sequence

```mermaid
sequenceDiagram
    participant App as Application
    participant Eng as Engine
    participant SM as SceneManager
    participant Scene
    participant GO as GameObjects
    participant Comp as Components
    participant RS as RenderService

    App->>Eng: start()
    activate Eng
    Eng->>RS: initialize()
    loop Game Loop
        Eng->>Eng: renderLoop()
        Eng->>SM: update(deltaTime)
        SM->>Scene: update(deltaTime)
        Scene->>GO: update(deltaTime) [for each]
        GO->>Comp: update(deltaTime) [for each]
        Eng->>SM: getCurrentScene()
        SM-->>Eng: currentScene
        Eng->>RS: render(currentScene)
        Eng->>InputManager: update()
    end
    deactivate Eng
```

### Core Components

1. **Engine**: Central game loop managing updates and rendering
2. **Scene**: Contains and manages GameObjects
3. **GameObject**: Container for Components, similar to Unity's concept
4. **Component**: Base class for all game behaviors
5. **RenderService**: Handles Three.js rendering
6. **InputManager**: Manages keyboard and mouse input

### Strengths

- Clean separation of concerns with DI
- Unity-like component architecture provides familiarity
- Scene management system for organized state transitions
- Strong TypeScript typing throughout the codebase
- Decoupled subsystems via interfaces and dependency injection

## Architecture Improvement Proposal

While the current architecture provides a solid foundation, the following enhancements would strengthen the engine's capabilities:

### Proposed Enhanced Architecture

```mermaid
graph TB
    subgraph Core
        Engine --> SceneManager
        Engine --> RenderService
        Engine --> InputManager
        Engine --> PhysicsEngine
        Engine --> EventBus
        Engine --> AudioManager
        Engine --> ResourceManager
    end

    subgraph Scene Management
        SceneManager --> Scene1
        SceneManager --> Scene2
        Scene1 --> GameObject1
        Scene1 --> GameObject2
        GameObject1 --> Component1
        GameObject1 --> Component2
    end

    subgraph Systems
        PhysicsSystem --> PhysicsEngine
        RenderSystem --> RenderService
        ResourceSystem --> ResourceManager
    end

    subgraph Events
        Component1 -.-> EventBus
        Component2 -.-> EventBus
        System1 -.-> EventBus
        System2 -.-> EventBus
    end

    EventBus -.-> PhysicsSystem
    EventBus -.-> RenderSystem
    ResourceManager --> Scene1
    ResourceManager --> Scene2
```

### 1. Entity Component System (ECS) Optimization

Consider evolving the current component system toward a more data-oriented ECS design:

```typescript
// Example: Systems operating on component data
class PhysicsSystem {
  update(deltaTime: number, entities: Entity[]): void {
    entities
      .filter((e) => e.hasComponent(RigidBody) && e.hasComponent(Transform))
      .forEach((entity) => {
        const body = entity.getComponent<RigidBody>(RigidBody);
        const transform = entity.getComponent<Transform>(Transform);
        // Apply physics
      });
  }
}
```

```mermaid
classDiagram
    class Entity {
        -id: string
        -components: Map
        +addComponent(component): void
        +getComponent<T>(): T
        +hasComponent(componentType): boolean
    }

    class ComponentData {
        +data properties
    }

    class System {
        +update(deltaTime, entities): void
    }

    class TransformComponent {
        +position: Vector3
        +rotation: Quaternion
        +scale: Vector3
    }

    class PhysicsComponent {
        +velocity: Vector3
        +mass: number
    }

    class PhysicsSystem {
        +update(deltaTime, entities): void
    }

    class RenderSystem {
        +update(deltaTime, entities): void
    }

    Entity --o ComponentData: has many
    System --> Entity: processes
    TransformComponent --|> ComponentData
    PhysicsComponent --|> ComponentData
    PhysicsSystem --|> System
    RenderSystem --|> System
```

Benefits:

- Better performance for games with many entities
- More cache-friendly data organization
- Clearer separation between data and behavior

### 2. Resource Management System

Add a dedicated resource management system:

```typescript
@injectable()
@singleton()
class ResourceManager {
  private textures: Map<string, THREE.Texture> = new Map();
  private models: Map<string, THREE.Mesh> = new Map();

  async loadTexture(key: string, url: string): Promise<THREE.Texture> {
    // Load and cache texture
  }

  async loadModel(key: string, url: string): Promise<THREE.Mesh> {
    // Load and cache model
  }
}
```

```mermaid
sequenceDiagram
    participant Scene
    participant RM as ResourceManager
    participant Cache
    participant Three as ThreeJS

    Scene->>RM: loadTexture("hero", "hero.png")
    RM->>Cache: check if exists
    alt In Cache
        Cache-->>RM: return cached texture
    else Not In Cache
        RM->>Three: load texture
        Three-->>RM: new texture
        RM->>Cache: store texture
    end
    RM-->>Scene: return texture
```

Benefits:

- Centralized asset loading and caching
- Memory usage optimization
- Asset reference counting and garbage collection

### 3. Event System

Implement a robust event system:

```typescript
@injectable()
@singleton()
class EventBus {
  private listeners: Map<string, Function[]> = new Map();

  on(event: string, callback: Function): void {
    // Add listener
  }

  off(event: string, callback: Function): void {
    // Remove listener
  }

  emit(event: string, ...args: any[]): void {
    // Trigger event
  }
}
```

```mermaid
sequenceDiagram
    participant Component1
    participant EventBus
    participant Component2
    participant Component3

    Component1->>EventBus: on("collision", handleCollision)
    Component2->>EventBus: on("collision", processPhysics)
    Component1->>EventBus: emit("collision", objectA, objectB)
    EventBus->>Component1: handleCollision(objectA, objectB)
    EventBus->>Component2: processPhysics(objectA, objectB)
    Component2->>EventBus: off("collision", processPhysics)
    Component1->>EventBus: emit("collision", objectA, objectC)
    EventBus->>Component1: handleCollision(objectA, objectC)
    Note over EventBus,Component2: Component2 no longer receives events
```

Benefits:

- Decoupled communication between systems
- Easier implementation of observer patterns
- Simplified cross-component coordination

### 4. Physics Integration

Add a physics abstraction layer:

```typescript
interface IPhysicsEngine {
  createRigidBody(mass: number): any;
  simulate(deltaTime: number): void;
  // etc.
}

@injectable()
class AmmoPhysics implements IPhysicsEngine {
  // Implementation using Ammo.js
}
```

```mermaid
graph TD
    subgraph Game Engine
        Engine --> PhysicsManager
        GameObject --> PhysicsComponent
        PhysicsComponent --> PhysicsManager
    end

    subgraph Physics API
        PhysicsManager --> IPhysicsEngine
        IPhysicsEngine --> AmmoPhysics
        IPhysicsEngine --> CannonPhysics
        IPhysicsEngine --> CustomPhysics
    end

    subgraph External Libraries
        AmmoPhysics --> Ammo.js
        CannonPhysics --> Cannon.js
    end
```

Benefits:

- Physics simulation capabilities
- Collision detection and response
- Potential for swappable physics backends

### 5. Enhanced Scene Management

Extend the scene management with loading and transitions:

```typescript
@injectable()
@singleton()
class SceneManager {
  // Existing implementation

  async loadSceneAsync(name: string): Promise<void> {
    // Show loading screen
    // Load scene assets
    // Initialize scene
    // Hide loading screen
  }

  transitionTo(name: string, transitionEffect: TransitionEffect): void {
    // Apply transition effect while switching scenes
  }
}
```

```mermaid
stateDiagram-v2
    [*] --> SceneA
    SceneA --> Loading: loadSceneAsync("B")
    Loading --> Transition: Assets Loaded
    Transition --> SceneB: Transition Complete
    SceneB --> Loading: loadSceneAsync("C")
    Loading --> Transition: Assets Loaded
    Transition --> SceneC: Transition Complete
    SceneC --> [*]
```

Benefits:

- Smoother scene transitions with effects
- Asynchronous scene loading with progress tracking
- Better user experience during level changes

### 6. Serialization System

Add serialization capabilities:

```typescript
interface ISerializable {
  serialize(): any;
  deserialize(data: any): void;
}

// Implementation in GameObject and Components
```

```mermaid
graph TD
    subgraph Game State
        Scene --> GameObject1
        Scene --> GameObject2
        GameObject1 --> Component1
        GameObject1 --> Component2
        GameObject2 --> Component3
    end

    subgraph Serialization
        Scene -- serialize --> JSON
        GameObject1 -- serialize --> JSON
        GameObject2 -- serialize --> JSON
        Component1 -- serialize --> JSON
        Component2 -- serialize --> JSON
        Component3 -- serialize --> JSON
        JSON -- deserialize --> NewScene
        NewScene -- recreate --> NewGameObject1
        NewScene -- recreate --> NewGameObject2
    end

    JSON --> SaveFile
    SaveFile --> LoadedJSON
    LoadedJSON --> Deserialization
```

Benefits:

- Save/load game state
- Level editing capabilities
- Network synchronization foundation

### 7. Audio Management

Implement a dedicated audio system:

```typescript
@injectable()
@singleton()
class AudioManager {
  playSound(id: string, options?: AudioOptions): void {}
  playMusic(id: string, options?: AudioOptions): void {}
  stopAll(): void {}
  // etc.
}
```

```mermaid
classDiagram
    class AudioManager {
        -sounds: Map
        -music: Map
        -currentMusic: AudioTrack
        +playSound(id, options): void
        +playMusic(id, options): void
        +stopAll(): void
        +setVolume(type, volume): void
    }

    class AudioTrack {
        -audio: HTMLAudioElement
        -options: AudioOptions
        +play(): void
        +pause(): void
        +stop(): void
        +setVolume(volume): void
    }

    class Spatial3DAudio {
        -position: Vector3
        -radius: number
        +updatePosition(position): void
    }

    AudioManager --> AudioTrack: manages
    Spatial3DAudio --|> AudioTrack
```

Benefits:

- Organized sound effect and music playback
- Spatial audio for 3D environments
- Audio pooling for performance

### 8. Rendering Pipeline Enhancements

Extend the render service with post-processing and lighting:

```typescript
@injectable()
@singleton()
class RenderService {
  // Existing implementation

  enablePostProcessing(effects: PostProcessEffect[]): void {}
  setLightingModel(model: LightingModel): void {}
  // etc.
}
```

```mermaid
graph TD
    Scene --> RenderService

    subgraph Render Pipeline
        RenderService --> SceneRenderer
        SceneRenderer --> PostProcessing
        PostProcessing --> Output
    end

    subgraph Post-Processing Stack
        PostProcessing --> Bloom
        PostProcessing --> DOF["Depth of Field"]
        PostProcessing --> SSAO["Screen Space Ambient Occlusion"]
        PostProcessing --> TonemappingHDR
    end

    subgraph Lighting
        SceneRenderer --> DirectionalLights
        SceneRenderer --> PointLights
        SceneRenderer --> AmbientLights
        SceneRenderer --> ShadowMaps
    end
```

Benefits:

- Visual effects like bloom, DOF, etc.
- Advanced lighting models
- Render-to-texture capabilities

## Implementation Roadmap

```mermaid
gantt
    title Implementation Roadmap
    dateFormat  YYYY-MM-DD
    section Phase 1
    Implement Event System       :p1_1, 2023-06-01, 30d
    Add Resource Management      :p1_2, after p1_1, 30d
    Enhance Scene Transitions    :p1_3, after p1_2, 30d

    section Phase 2
    Physics Integration          :p2_1, after p1_3, 45d
    Audio System                 :p2_2, after p2_1, 30d
    Serialization Support        :p2_3, after p2_2, 30d

    section Phase 3
    Rendering Pipeline           :p3_1, after p2_3, 45d
    ECS Optimization             :p3_2, after p3_1, 60d
    Debug & Profiling Tools      :p3_3, after p3_2, 30d

    section Phase 4
    Scene Editor                 :p4_1, after p3_3, 60d
    Prefab Support               :p4_2, after p4_1, 30d
    Runtime Debugging Tools      :p4_3, after p4_2, 30d
```

1. **Phase 1**: Refine core architecture

   - Implement event system
   - Add resource management
   - Enhance scene transitions

2. **Phase 2**: Expand game capabilities

   - Add physics integration
   - Implement audio system
   - Add serialization support

3. **Phase 3**: Graphics and performance

   - Enhance rendering pipeline
   - Optimize for performance with ECS principles
   - Add debug and profiling tools

4. **Phase 4**: Tools and workflow
   - Create a simple scene editor
   - Add prefab support for reusable game objects
   - Implement runtime debugging tools

## Conclusion

The current architecture provides a solid foundation with clear separation of concerns and a familiar component pattern. By implementing the proposed enhancements incrementally, the engine can evolve into a more capable platform while maintaining its clean design.

The priority should be on building features that directly enable game development workflows rather than attempting to compete with fully-featured commercial engines. Focus on creating a lightweight, performant engine that excels at specific use cases rather than trying to be all things to all developers.

## Modular Architecture Update (2023)

To improve maintainability and organization, the engine has been restructured into a modular architecture:

```mermaid
graph TD
    subgraph Core
        Engine
        SceneManager
        GameObject
        Component
    end

    subgraph Modules
        Resources[Resources Module]
        Rendering[Rendering Module]
        Events[Events Module]
        Physics[Physics Module]
        UI[UI Module]
        Input[Input Module]
        Audio[Audio Module]
    end

    Engine --> Resources
    Engine --> Rendering
    Engine --> Events
    Engine --> Physics
    Engine --> UI
    Engine --> Input
    Engine --> Audio

    subgraph Scenes
        GameScenes
    end

    SceneManager --> GameScenes
    GameScenes --> GameObject
    GameObject --> Component
```

### Implemented Modules

The following modules have been implemented:

1. **Resources Module**: Asset loading and management

   - ResourceManager - Central service for loading and managing game assets
   - ResourceCache - System for caching loaded assets
   - Loaders - Specialized loaders for different asset types (TextureLoader, ModelLoader, etc.)

2. **Rendering Module**: Graphics rendering

   - RenderService - Handles Three.js rendering and camera management

3. **Events Module**: Event communication

   - EventBus - Pub/sub system for decoupled communication

4. **Physics Module**: Physics simulation

   - CollisionComponent - Detects collisions between game objects
   - CollisionHandlerComponent - Handles collision responses

5. **UI Module**: User interface management
   - UIService - Manages UI components and rendering

### Remaining Work

1. **Input Module**: Currently exists as InputManager in utils but should be migrated
2. **Audio Module**: To be implemented for sound and music playback

### Path Alias System

The engine now uses a path alias system for cleaner imports:

```typescript
// Before
import { ResourceManager } from '../../services/ResourceManager';

// After
import { ResourceManager } from '@modules/resources/ResourceManager';
```

See the [Folder Restructuring](folder-restructuring.md) document for more details about the new architecture.
