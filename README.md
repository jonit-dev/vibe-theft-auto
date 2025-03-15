# Vibe Theft Auto

A scalable Three.js scaffold with TSyringe for dependency injection.

## Features

- 3D rendering with Three.js
- Dependency injection with TSyringe's @autoInjectable
- TypeScript for type safety
- Scene management system
- Input handling
- Webpack for bundling

## Project Structure

```
├── public/             # Static files
│   └── index.html      # Main HTML entry point
├── src/                # Source code
│   ├── core/           # Core engine components
│   │   ├── Engine.ts   # Main game loop
│   │   ├── Container.ts # DI setup
│   │   └── SceneManager.ts # Scene management
│   ├── scenes/         # Game scenes
│   │   ├── BaseScene.ts # Abstract scene class
│   │   └── MainScene.ts # Demo scene
│   ├── services/       # Services
│   │   └── RenderService.ts # Rendering service
│   ├── utils/          # Utilities
│   │   └── InputManager.ts # Input handling
│   └── index.ts        # Application entry point
└── webpack.config.js   # Webpack configuration
```

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- Yarn package manager

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/vibe-theft-auto.git
   cd vibe-theft-auto
   ```

2. Install dependencies:
   ```
   yarn install
   ```

### Running the Development Server

Start the development server with hot reloading:

```
yarn dev
```

This will:

- Build the project
- Start a development server
- Open your browser at http://localhost:9000

If the browser doesn't open automatically, manually navigate to http://localhost:9000.

### Available Scripts

| Command      | Description                               |
| ------------ | ----------------------------------------- |
| `yarn start` | Starts dev server and opens browser       |
| `yarn dev`   | Starts dev server without opening browser |
| `yarn build` | Builds for production to `dist/` folder   |

## Building for Production

Create a production build:

```
yarn build
```

The optimized output will be in the `dist` directory. You can serve these files using any static file server.

## Dependency Injection

This project uses TSyringe with `@autoInjectable()` for simple dependency injection.
Services are automatically resolved when injected into constructors.

Example:

```typescript
@autoInjectable()
export class MyClass {
  constructor(private someService?: SomeService) {}
}
```

## Troubleshooting

If you encounter any issues:

1. Make sure all dependencies are installed:

   ```
   yarn install
   ```

2. Clear the build cache and rebuild:

   ```
   rm -rf dist node_modules/.cache
   yarn build
   ```

3. Check browser console for errors

## License

MIT
