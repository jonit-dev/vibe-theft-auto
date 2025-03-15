import * as THREE from 'three';
import { GameObject } from './GameObject';
import { IGameObject } from './interfaces/IGameObject';
import { IScene } from './interfaces/IScene';

/**
 * Scene class that manages GameObjects
 * Replaces the previous BaseScene concept
 */
export class Scene implements IScene {
  // The Three.js scene
  private scene: THREE.Scene;
  // Map of game objects by id
  private gameObjects: Map<string, GameObject> = new Map();
  // Whether the scene has been initialized
  private initialized: boolean = false;

  constructor() {
    this.scene = new THREE.Scene();
  }

  /**
   * Called when the scene is first entered
   */
  public onEnter(): void {
    // Initialize all game objects if not already initialized
    if (!this.initialized) {
      this.gameObjects.forEach((gameObject) => {
        gameObject.start();
      });
      this.initialized = true;
    }
  }

  /**
   * Called when the scene is exited
   */
  public onExit(): void {
    // Scene cleanup logic can go here
  }

  /**
   * Update all active game objects
   * @param deltaTime Time in seconds since last frame
   */
  public update(deltaTime: number): void {
    this.gameObjects.forEach((gameObject) => {
      if (gameObject.isActive()) {
        gameObject.update(deltaTime);
      }
    });
  }

  /**
   * Create a new game object in this scene
   * @param id Unique identifier for the game object
   * @returns The newly created game object
   */
  public createGameObject(id: string): GameObject {
    if (this.gameObjects.has(id)) {
      console.warn(
        `GameObject with id ${id} already exists, returning existing one`
      );
      return this.gameObjects.get(id)!;
    }

    const gameObject = new GameObject(id, this);
    this.gameObjects.set(id, gameObject);
    this.scene.add(gameObject.getObject3D());

    // If the scene is already initialized, call start on the new game object
    if (this.initialized) {
      gameObject.start();
    }

    return gameObject;
  }

  /**
   * Get a game object by id
   * @param id The id of the game object to find
   */
  public getGameObject(id: string): GameObject | undefined {
    return this.gameObjects.get(id);
  }

  /**
   * Remove a game object from this scene
   * @param gameObject The game object to remove
   */
  public removeGameObject(gameObject: IGameObject): void {
    this.gameObjects.delete(gameObject.getId());
  }

  /**
   * Get all game objects in this scene
   */
  public getAllGameObjects(): GameObject[] {
    return Array.from(this.gameObjects.values());
  }

  /**
   * Get the Three.js scene
   */
  public getThreeScene(): THREE.Scene {
    return this.scene;
  }
}
