import { injectable, singleton } from 'tsyringe';

@injectable()
@singleton()
export class InputManager {
  private keys: Map<string, boolean> = new Map();
  private previousKeys: Map<string, boolean> = new Map();
  private mousePosition: { x: number; y: number } = { x: 0, y: 0 };
  private mouseButtons: Map<number, boolean> = new Map();
  private previousMouseButtons: Map<number, boolean> = new Map();

  constructor() {
    // Set up keyboard listeners
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));

    // Set up mouse listeners
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('mousedown', this.onMouseDown.bind(this));
    window.addEventListener('mouseup', this.onMouseUp.bind(this));

    console.log('InputManager initialized');
  }

  /**
   * Check if a key is currently held down
   * Alias for isKeyDown for Unity-like API consistency
   */
  public isKeyPressed(key: string): boolean {
    return this.isKeyDown(key);
  }

  /**
   * Check if a key was just pressed this frame
   * Returns true only on the first frame the key is down
   */
  public isKeyJustPressed(key: string): boolean {
    // Check both the key and the key code
    return this.isCodeJustPressed(key) || this.isKeyJustPressed2(key);
  }

  private isKeyJustPressed2(key: string): boolean {
    const normalizedKey = key.toLowerCase();
    return (
      this.keys.get(normalizedKey) === true &&
      this.previousKeys.get(normalizedKey) !== true
    );
  }

  private isCodeJustPressed(code: string): boolean {
    return this.keys.get(code) === true && this.previousKeys.get(code) !== true;
  }

  /**
   * Check if a key is currently down
   */
  public isKeyDown(key: string): boolean {
    // Check in various formats - as a key and as a code
    return (
      this.keys.get(key) === true ||
      this.keys.get(key.toLowerCase()) === true ||
      this.keys.get('Key' + key.toUpperCase()) === true
    );
  }

  /**
   * Check if a mouse button is currently down
   */
  public isMouseButtonDown(button: number): boolean {
    return this.mouseButtons.get(button) || false;
  }

  /**
   * Check if a mouse button was just pressed this frame
   */
  public isMouseButtonJustPressed(button: number): boolean {
    return (
      this.mouseButtons.get(button) === true &&
      this.previousMouseButtons.get(button) !== true
    );
  }

  /**
   * Get the current mouse position
   */
  public getMousePosition(): { x: number; y: number } {
    return { ...this.mousePosition };
  }

  /**
   * Update the input state
   * Should be called at the end of each frame
   */
  public update(): void {
    // Store current state as previous state
    this.previousKeys = new Map(this.keys);
    this.previousMouseButtons = new Map(this.mouseButtons);
  }

  private onKeyDown(event: KeyboardEvent): void {
    // Store both the key and the keyCode for compatibility
    this.keys.set(event.key.toLowerCase(), true);
    this.keys.set(event.code, true);
    console.log(`Key down: ${event.key}, code: ${event.code}`);
  }

  private onKeyUp(event: KeyboardEvent): void {
    // Clear both the key and the keyCode for compatibility
    this.keys.set(event.key.toLowerCase(), false);
    this.keys.set(event.code, false);
    console.log(`Key up: ${event.key}, code: ${event.code}`);
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
