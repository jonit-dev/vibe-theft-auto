import { injectable, singleton } from 'tsyringe';

/**
 * EventBus handles communication between components and systems
 * through a pub/sub pattern, decoupling components from each other.
 */
@injectable()
@singleton()
export class EventBus {
  private listeners: Map<string, Function[]> = new Map();

  /**
   * Register a listener for a specific event
   * @param event The event name to listen for
   * @param callback The function to call when the event is emitted
   */
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    const callbacks = this.listeners.get(event)!;
    if (!callbacks.includes(callback)) {
      callbacks.push(callback);
    }
  }

  /**
   * Remove a listener for a specific event
   * @param event The event name
   * @param callback The callback function to remove
   */
  off(event: string, callback: Function): void {
    if (!this.listeners.has(event)) return;

    const callbacks = this.listeners.get(event)!;
    const index = callbacks.indexOf(callback);

    if (index !== -1) {
      callbacks.splice(index, 1);

      // Clean up empty event arrays
      if (callbacks.length === 0) {
        this.listeners.delete(event);
      }
    }
  }

  /**
   * Emit an event with optional arguments
   * @param event The event name to emit
   * @param args Optional arguments to pass to listeners
   */
  emit(event: string, ...args: any[]): void {
    if (!this.listeners.has(event)) return;

    const callbacks = this.listeners.get(event)!;
    for (const callback of callbacks) {
      callback(...args);
    }
  }

  /**
   * Check if an event has any listeners
   * @param event The event name to check
   */
  hasListeners(event: string): boolean {
    return this.listeners.has(event) && this.listeners.get(event)!.length > 0;
  }

  /**
   * Get the number of listeners for an event
   * @param event The event name
   */
  listenerCount(event: string): number {
    return this.listeners.has(event) ? this.listeners.get(event)!.length : 0;
  }

  /**
   * Remove all listeners for a specific event or all events
   * @param event Optional event name. If not provided, all events are cleared
   */
  clear(event?: string): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}
