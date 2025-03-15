import { autoInjectable, singleton } from 'tsyringe';

@autoInjectable()
@singleton()
export class InputManager {
  private keys: Map<string, boolean> = new Map();
  private mousePosition: { x: number; y: number } = { x: 0, y: 0 };
  private mouseButtons: Map<number, boolean> = new Map();

  constructor() {
    // Set up keyboard listeners
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));

    // Set up mouse listeners
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('mousedown', this.onMouseDown.bind(this));
    window.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  public isKeyDown(key: string): boolean {
    return this.keys.get(key.toLowerCase()) || false;
  }

  public isMouseButtonDown(button: number): boolean {
    return this.mouseButtons.get(button) || false;
  }

  public getMousePosition(): { x: number; y: number } {
    return { ...this.mousePosition };
  }

  private onKeyDown(event: KeyboardEvent): void {
    this.keys.set(event.key.toLowerCase(), true);
  }

  private onKeyUp(event: KeyboardEvent): void {
    this.keys.set(event.key.toLowerCase(), false);
  }

  private onMouseMove(event: MouseEvent): void {
    this.mousePosition = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  private onMouseDown(event: MouseEvent): void {
    this.mouseButtons.set(event.button, true);
  }

  private onMouseUp(event: MouseEvent): void {
    this.mouseButtons.set(event.button, false);
  }
}
