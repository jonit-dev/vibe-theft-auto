import { Component } from '@/core/Component';
import { IGameObject } from '@/core/interfaces/IGameObject';
import * as THREE from 'three';

/**
 * Transform component to handle position, rotation, and scale
 * Example of a basic component
 */
export class Transform extends Component {
  private position: THREE.Vector3;
  private rotation: THREE.Euler;
  private scale: THREE.Vector3;

  constructor(gameObject: IGameObject) {
    super(gameObject);

    // Get the Object3D from the game object
    const obj = this.gameObject.getObject3D();

    // Initialize with current values
    this.position = obj.position;
    this.rotation = obj.rotation;
    this.scale = obj.scale;
  }

  /**
   * Set the position of this game object
   */
  public setPosition(x: number, y: number, z: number): void {
    this.position.set(x, y, z);
  }

  /**
   * Set the rotation of this game object (in radians)
   */
  public setRotation(x: number, y: number, z: number): void {
    this.rotation.set(x, y, z);
  }

  /**
   * Set the scale of this game object
   */
  public setScale(x: number, y: number, z: number): void {
    this.scale.set(x, y, z);
  }

  /**
   * Get the position of this game object
   */
  public getPosition(): THREE.Vector3 {
    return this.position.clone();
  }

  /**
   * Get the rotation of this game object
   */
  public getRotation(): THREE.Euler {
    return this.rotation.clone();
  }

  /**
   * Get the scale of this game object
   */
  public getScale(): THREE.Vector3 {
    return this.scale.clone();
  }

  /**
   * Translate the game object
   */
  public translate(x: number, y: number, z: number): void {
    this.position.x += x;
    this.position.y += y;
    this.position.z += z;
  }

  /**
   * Rotate the game object (in radians)
   */
  public rotate(x: number, y: number, z: number): void {
    this.rotation.x += x;
    this.rotation.y += y;
    this.rotation.z += z;
  }
}
