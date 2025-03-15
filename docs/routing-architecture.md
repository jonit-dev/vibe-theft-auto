# Routing Architecture: React Router & Three.js Scene Management

## Overview

This project implements a hybrid routing architecture that separates concerns:

- **React Router**: Handles traditional web navigation for authentication, menus, and settings
- **Three.js Scene Manager**: Manages in-game scene transitions and game state

This approach allows each system to excel at what it does best while maintaining a clean separation of concerns.

```mermaid
graph TB
    User((User)) --> Login
    subgraph "React Router"
        Login --> Register
        Login --> ForgotPassword
        Login --> MainMenu
        MainMenu --> Settings
        MainMenu --> Profile
        MainMenu --> GameContainer
    end

    subgraph "Three.js Engine"
        GameContainer --> SceneManager
        SceneManager --> IntroScene
        IntroScene --> EventDemoScene
        IntroScene --> MainScene
        EventDemoScene -.-> MainScene
    end

    GameContainer -.-> MainMenu
    style GameContainer fill:#f9f,stroke:#333
    style SceneManager fill:#bbf,stroke:#333
```

## React Router Architecture

### Routing Structure

React Router manages all non-game navigation through a traditional URL-based approach.

```mermaid
classDiagram
    class BrowserRouter {
        +Routes
    }

    class Routes {
        +Route[]
    }

    class Route {
        +path: string
        +element: ReactComponent
    }

    class ProtectedRoute {
        +isAuthenticated: boolean
        +onUnauthenticated(): void
        +children: ReactNode
    }

    BrowserRouter --> Routes
    Routes *-- Route
    Route <|-- ProtectedRoute
```

### URL Structure

| Path               | Component        | Description                    |
| ------------------ | ---------------- | ------------------------------ |
| `/`                | `Login`          | Authentication entry point     |
| `/register`        | `Register`       | New user registration          |
| `/forgot-password` | `ForgotPassword` | Password recovery flow         |
| `/menu`            | `MainMenu`       | Game selection and main menu   |
| `/settings`        | `Settings`       | User preferences               |
| `/profile`         | `UserProfile`    | User profile management        |
| `/game`            | `GameContainer`  | Entry point to Three.js engine |

### Implementation Example

```typescript
// App.tsx
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route
          path='/menu'
          element={
            <ProtectedRoute>
              <MainMenu />
            </ProtectedRoute>
          }
        />
        <Route
          path='/settings'
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/game'
          element={
            <ProtectedRoute>
              <GameContainer />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
};
```

## Three.js Scene Management

The Three.js engine uses a scene-based architecture for managing game states and transitions.

```mermaid
classDiagram
    class SceneManager {
        -scenes: Map<string, IScene>
        -currentScene: IScene
        +registerScene(name: string, scene: IScene): void
        +switchScene(name: string): void
        +getCurrentScene(): IScene
        +update(deltaTime: number): void
    }

    class IScene {
        <<interface>>
        +onEnter(): void
        +onExit(): void
        +update(deltaTime: number): void
    }

    class BaseScene {
        #scene: THREE.Scene
        #gameObjects: Map<string, IGameObject>
        +onEnter(): void
        +onExit(): void
        +update(deltaTime: number): void
        +createGameObject(id: string): IGameObject
    }

    class IntroScene {
        -ui: IntroUI
        +onEnter(): void
        +onExit(): void
        +handleSceneSelection(sceneName: string): void
    }

    class MainScene {
        +onEnter(): void
        +onExit(): void
    }

    class EventDemoScene {
        +onEnter(): void
        +onExit(): void
    }

    SceneManager --> "0..*" IScene
    IScene <|.. BaseScene
    BaseScene <|-- IntroScene
    BaseScene <|-- MainScene
    BaseScene <|-- EventDemoScene
```

### Scene Transition Flow

```mermaid
stateDiagram-v2
    [*] --> IntroScene
    IntroScene --> EventDemoScene: Select "Event Demo"
    IntroScene --> MainScene: Select "Main Scene"
    EventDemoScene --> IntroScene: Back to Intro
    MainScene --> IntroScene: Back to Intro
    IntroScene --> [*]: Exit to Menu
```

### Scene Transition Implementation

```typescript
// SceneManager.ts
switchScene(name: string): void {
  // Exit current scene if exists
  if (this.currentScene) {
    this.currentScene.onExit();
  }

  // Get and enter new scene
  const newScene = this.scenes.get(name);
  if (!newScene) {
    throw new Error(`Scene ${name} not found`);
  }

  this.currentScene = newScene;
  this.currentScene.onEnter();
}
```

## Integration Between Systems

The key to a seamless user experience is proper integration between React Router and Three.js scene management.

```mermaid
sequenceDiagram
    participant User
    participant ReactRouter
    participant GameContainer
    participant Engine
    participant SceneManager
    participant IntroScene

    User->>ReactRouter: Navigate to /game
    ReactRouter->>GameContainer: Mount component
    GameContainer->>Engine: initialize()
    Engine->>SceneManager: initialize()
    SceneManager->>IntroScene: onEnter()
    IntroScene-->>User: Display scene UI

    User->>IntroScene: Select "Event Demo"
    IntroScene->>SceneManager: switchScene("eventDemo")

    User->>GameContainer: Click "Back to Menu"
    GameContainer->>Engine: stop()
    GameContainer->>ReactRouter: navigate("/menu")
    ReactRouter-->>User: Display menu
```

### Key Integration Points

1. **Game Initialization**: When navigating to `/game`, React initializes the Three.js engine
2. **UI Integration**: Game UI components overlay on top of Three.js canvas
3. **Exit Points**: "Back to Menu" button stops the engine and returns to React Router

```typescript
// GameContainer.tsx
const GameContainer: React.FC = () => {
  const navigate = useNavigate();
  const [app, setApp] = useState<Application | null>(null);

  useEffect(() => {
    // Initialize game engine
    const gameApp = container.resolve(Application);
    setApp(gameApp);
    gameApp.start();

    return () => {
      // Cleanup when component unmounts
      if (app) {
        app.stop();
      }
    };
  }, []);

  const handleBackToMenu = () => {
    if (app) {
      app.stop();
    }
    navigate('/menu');
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* UI overlays */}
      <button onClick={handleBackToMenu}>Back to Menu</button>
    </div>
  );
};
```

## Best Practices

### React Router Best Practices

1. **Authentication Guards**: Protect routes that require authentication
2. **Code Splitting**: Use React.lazy() for route-based code splitting
3. **Consistent Navigation**: Provide clear navigation patterns and breadcrumbs
4. **Loading States**: Show loading indicators during transitions

### Three.js Scene Best Practices

1. **Resource Management**: Load and unload resources during scene transitions
2. **Transition Effects**: Use smooth transitions between scenes
3. **State Persistence**: Maintain relevant state between scene transitions
4. **Error Handling**: Implement fallback scenes for error conditions

```mermaid
graph TD
    A[Resource Loading] --> B[Scene Initialization]
    B --> C{Scene Ready?}
    C -->|Yes| D[Fade In]
    C -->|No| E[Show Loading]
    E --> C
    D --> F[Scene Active]
    F --> G[User Input]
    G --> H{Change Scene?}
    H -->|Yes| I[Fade Out]
    H -->|No| G
    I --> J[Cleanup Resources]
    J --> A
```

## Implementation Guidelines

### React Integration Points

- Use dependency injection for sharing services between React and Three.js
- Create abstraction layers for communication between systems
- Implement custom hooks for game-related functionality

### Game Engine Initialization

Proper initialization is critical for seamless integration:

```typescript
// Application.ts
@injectable()
@singleton()
export class Application {
  constructor(
    private engine: Engine,
    private sceneManager: SceneManager,
    private mainScene: MainScene,
    private introScene: IntroScene,
    private eventDemoScene: EventDemoScene
  ) {
    this.initialize();
  }

  private initialize(): void {
    // Register all scenes
    this.sceneManager.registerScene('main', this.mainScene);
    this.sceneManager.registerScene('intro', this.introScene);
    this.sceneManager.registerScene('eventDemo', this.eventDemoScene);

    // Start with the intro scene
    this.sceneManager.switchScene('intro');
  }

  public start(): void {
    this.engine.start();
  }

  public stop(): void {
    this.engine.stop();
  }
}
```

## Error Handling and Edge Cases

1. **Failed Scene Loading**: Implement fallback scenes and error reporting
2. **Deep Linking**: Handle direct navigation to `/game` with proper initialization
3. **Resource Cleanup**: Ensure proper cleanup when switching between React and Three.js
4. **Browser Refresh**: Manage state persistence across page reloads

## Performance Considerations

```mermaid
graph LR
    A[Asset Preloading] --> B[Scene Transitions]
    C[Code Splitting] --> D[React Component Loading]
    E[Resource Pooling] --> B
    F[WebGL Context Preservation] --> G[Three.js Performance]
    H[React Suspense] --> D
```

1. **Asset Management**: Preload assets for common scenes
2. **React Performance**: Minimize component re-renders during game operation
3. **Three.js Optimization**: Implement proper resource management and disposal
4. **Memory Management**: Watch for and prevent memory leaks, especially during transitions

## Conclusion

This hybrid routing architecture provides the best of both worlds: React Router for traditional web navigation and Three.js scene management for immersive game experiences. By clearly defining the boundaries and integration points between these systems, we create a maintainable and performant application structure.
