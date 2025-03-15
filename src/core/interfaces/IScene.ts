import * as THREE from 'three';
import { IGameObject } from './IGameObject';

/**
 * Interface for Scene to break circular references
 */
export interface IScene {
  onEnter(): void;
  onExit(): void;
  update(deltaTime: number): void;
  createGameObject(id: string): IGameObject;
  getGameObject(id: string): IGameObject | undefined;
  removeGameObject(gameObject: IGameObject): void;
  getAllGameObjects(): IGameObject[];
  getThreeScene(): THREE.Scene;
}
