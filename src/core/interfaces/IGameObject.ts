import * as THREE from 'three';
import { Component } from '../Component';
import { IScene } from './IScene';

/**
 * Interface for GameObject to break circular references
 */
export interface IGameObject {
  addComponent<T extends Component>(
    componentType: new (gameObject: IGameObject) => T
  ): T;
  getComponent<T extends Component>(
    componentType: new (...args: any[]) => T
  ): T | null;
  getComponents<T extends Component>(
    componentType: new (...args: any[]) => T
  ): T[];
  removeComponent(component: Component): void;
  start(): void;
  update(deltaTime: number): void;
  destroy(): void;
  setActive(active: boolean): void;
  isActive(): boolean;
  getObject3D(): THREE.Object3D;
  getId(): string;
  getScene(): IScene;
}
