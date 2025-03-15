import React from 'react';
import { createRoot, Root } from 'react-dom/client';

interface ReactContainerProps {
  children: React.ReactNode;
}

export class ReactContainer {
  private containerElement: HTMLDivElement;
  private root: Root;

  constructor() {
    // Create container div for React
    this.containerElement = document.createElement('div');
    this.containerElement.id = 'react-container';
    document.body.appendChild(this.containerElement);

    // Create root for React 18+
    this.root = createRoot(this.containerElement);
  }

  public render(component: React.ReactNode): void {
    this.root.render(<React.StrictMode>{component}</React.StrictMode>);
  }

  public unmount(): void {
    this.root.unmount();
  }

  public destroy(): void {
    this.unmount();
    if (this.containerElement && this.containerElement.parentNode) {
      this.containerElement.parentNode.removeChild(this.containerElement);
    }
  }
}
