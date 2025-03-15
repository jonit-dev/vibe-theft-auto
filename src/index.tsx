import 'reflect-metadata';

import React from 'react';
import { createRoot } from 'react-dom/client';

// Import global styles
import './ui/styles/global.css';

// Setup dependency injection
import { setupContainer } from './setupContainer';
setupContainer();

// Import React app
import App from './ui/App';

// Render the React app
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

console.log('Application initialized!');
