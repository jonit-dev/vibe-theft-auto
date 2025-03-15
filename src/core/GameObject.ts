import * as THREE from 'three';
import { Component } from './Component';
import { IGameObject } from './interfaces/IGameObject';
import { IScene } from './interfaces/IScene';

/**
 * GameObject class that manages components
 * Similar to Unity's GameObject concept
 */
export class GameObject implements IGameObject {
  // Unique identifier for this game object
  private id: string;
  // Reference to the scene this game object belongs to
  private scene: IScene;
  // Three.js object for rendering
  private object3D: THREE.Object3D;
  // Components attached to this game object
  private components: Component[] = [];
  // Whether this game object is active
  private active: boolean = true;

  constructor(id: string, scene: IScene) {
    this.id = id;
    this.scene = scene;
    this.object3D = new THREE.Object3D();
  }

  /**
   * Add a component to this game object
   * @param componentType The component class to instantiate
   * @returns The newly created component instance
   */
  public addComponent<T extends Component>(
    componentType: new (gameObject: IGameObject) => T
  ): T {
    const component = new componentType(this);
    this.components.push(component);

    // If the game object is already active, call start on the new component
    if (this.active) {
      component.internal_start();
    }

    return component;
  }

  /**
   * Get a component of a specific type
   * @param componentType The component class to find
   * @returns The first component of the given type, or null if not found
   */
  public getComponent<T extends Component>(
    componentType: new (...args: any[]) => T
  ): T | null {
    for (const component of this.components) {
      if (component instanceof componentType) {
        return component as T;
      }
    }
    return null;
  }

  /**
   * Get all components of a specific type
   * @param componentType The component class to find
   * @returns An array of all components of the given type
   */
  public getComponents<T extends Component>(
    componentType: new (...args: any[]) => T
  ): T[] {
    return this.components.filter(
      (component) => component instanceof componentType
    ) as T[];
  }

  /**
   * Remove a component from this game object
   * @param component The component to remove
   */
  public removeComponent(component: Component): void {
    const index = this.components.indexOf(component);
    if (index !== -1) {
      component.destroy();
      this.components.splice(index, 1);
    }
  }

  /**
   * Initialize all components
   * Called when the game object is first activated
   */
  public start(): void {
    if (!this.active) return;

    for (const component of this.components) {
      component.internal_start();
    }
  }

  /**
   * Update all active components
   * @param deltaTime Time in seconds since last frame
   */
  public update(deltaTime: number): void {
    if (!this.active) return;

    for (const component of this.components) {
      if (component.isEnabled()) {
        component.update(deltaTime);
      }
    }
  }

  /**
   * Destroy this game object and all its components
   */
  public destroy(): void {
    // Call destroy on all components
    for (const component of this.components) {
      component.destroy();
    }

    // Clear components array
    this.components = [];

    // Remove from scene
    this.scene.removeGameObject(this);

    // Remove from parent
    if (this.object3D.parent) {
      this.object3D.parent.remove(this.object3D);
    }
  }

  /**
   * Set the active state of this game object
   */
  public setActive(active: boolean): void {
    if (this.active === active) return;

    this.active = active;
    this.object3D.visible = active;

    // Start components if being activated for the first time
    if (active) {
      this.start();
    }
  }

  /**
   * Check if this game object is active
   */
  public isActive(): boolean {
    return this.active;
  }

  /**
   * Get the Three.js object associated with this game object
   */
  public getObject3D(): THREE.Object3D {
    return this.object3D;
  }

  /**
   * Get the id of this game object
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Get the scene this game object belongs to
   */
  public getScene(): IScene {
    return this.scene;
  }
}
