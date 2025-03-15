import * as THREE from 'three';
import { injectable } from 'tsyringe';
import { Camera } from './Camera';

export interface CameraWaypoint {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  duration: number;
  easing?: (t: number) => number;
}

export class Easing {
  static linear(t: number): number {
    return t;
  }

  static easeInQuad(t: number): number {
    return t * t;
  }

  static easeOutQuad(t: number): number {
    return t * (2 - t);
  }

  static easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  static easeInCubic(t: number): number {
    return t * t * t;
  }

  static easeOutCubic(t: number): number {
    return --t * t * t + 1;
  }

  static easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }
}

/**
 * A camera designed for scripted sequences with predefined movements
 */
@injectable()
export class CinematicCamera extends Camera {
  private waypoints: CameraWaypoint[] = [];
  private currentWaypoint: number = 0;
  private isPlaying: boolean = false;
  private elapsed: number = 0;
  private eventCallbacks: Map<string, Function[]> = new Map();

  constructor(
    options: { fov?: number; aspect?: number; near?: number; far?: number } = {}
  ) {
    super('cinematicCamera');

    // Create perspective camera
    this.camera = new THREE.PerspectiveCamera(
      options.fov || 60,
      options.aspect || window.innerWidth / window.innerHeight,
      options.near || 0.1,
      options.far || 1000
    );
  }

  /**
   * Add a waypoint to the camera path
   * @param waypoint - The waypoint to add
   */
  public addWaypoint(waypoint: CameraWaypoint): void {
    // Apply default easing if not provided
    if (!waypoint.easing) {
      waypoint.easing = Easing.easeInOutCubic;
    }
    this.waypoints.push(waypoint);
  }

  /**
   * Clear all waypoints
   */
  public clearWaypoints(): void {
    this.waypoints = [];
    this.currentWaypoint = 0;
    this.elapsed = 0;
  }

  /**
   * Start playing the camera sequence
   */
  public play(): void {
    if (this.waypoints.length === 0) {
      console.warn('No waypoints defined for cinematic camera sequence');
      return;
    }

    this.isPlaying = true;
    this.currentWaypoint = 0;
    this.elapsed = 0;

    // Position camera at the first waypoint
    const firstWaypoint = this.waypoints[0];
    this.camera.position.copy(firstWaypoint.position);
    this.camera.lookAt(firstWaypoint.lookAt);

    this.trigger('sequence.start');
  }

  /**
   * Pause the camera sequence
   */
  public pause(): void {
    this.isPlaying = false;
    this.trigger('sequence.pause');
  }

  /**
   * Resume the camera sequence
   */
  public resume(): void {
    this.isPlaying = true;
    this.trigger('sequence.resume');
  }

  /**
   * Stop the camera sequence
   */
  public stop(): void {
    this.isPlaying = false;
    this.currentWaypoint = 0;
    this.elapsed = 0;
    this.trigger('sequence.stop');
  }

  /**
   * Check if the camera sequence is playing
   */
  public isSequencePlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Register an event callback
   * @param event - Event name to listen for
   * @param callback - Function to call when the event occurs
   */
  public on(event: string, callback: Function): void {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, []);
    }
    this.eventCallbacks.get(event)!.push(callback);
  }

  /**
   * Remove an event callback
   * @param event - Event name
   * @param callback - Function to remove
   */
  public off(event: string, callback: Function): void {
    if (!this.eventCallbacks.has(event)) return;

    const callbacks = this.eventCallbacks.get(event)!;
    const index = callbacks.indexOf(callback);

    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }

  /**
   * Trigger an event
   * @param event - Event name to trigger
   * @param args - Arguments to pass to the callbacks
   */
  private trigger(event: string, ...args: any[]): void {
    if (!this.eventCallbacks.has(event)) return;

    for (const callback of this.eventCallbacks.get(event)!) {
      callback(...args);
    }
  }

  /**
   * Update the camera position and rotation based on waypoints
   * @param deltaTime - Time in seconds since the last frame
   */
  public update(deltaTime: number): void {
    if (!this.isPlaying || this.waypoints.length === 0) return;

    const currentPoint = this.waypoints[this.currentWaypoint];
    this.elapsed += deltaTime;

    // If we've reached the end of the current waypoint's duration
    if (this.elapsed >= currentPoint.duration) {
      // Move to the next waypoint
      this.currentWaypoint++;
      this.elapsed = 0;

      // If we've reached the end of all waypoints
      if (this.currentWaypoint >= this.waypoints.length) {
        this.isPlaying = false;
        this.currentWaypoint = 0;
        this.trigger('sequence.complete');
        return;
      }

      this.trigger('waypoint.complete', this.currentWaypoint - 1);
      this.trigger('waypoint.start', this.currentWaypoint);
      return;
    }

    // Calculate progress through current waypoint (0 to 1)
    const t = this.elapsed / currentPoint.duration;

    // Apply easing function
    const easedT = currentPoint.easing ? currentPoint.easing(t) : t;

    // Get current and next waypoint
    const current = currentPoint;
    const next =
      this.waypoints[(this.currentWaypoint + 1) % this.waypoints.length];

    // Interpolate position
    const position = new THREE.Vector3().lerpVectors(
      current.position,
      next.position,
      easedT
    );

    // Interpolate lookAt
    const lookAt = new THREE.Vector3().lerpVectors(
      current.lookAt,
      next.lookAt,
      easedT
    );

    // Update camera
    this.camera.position.copy(position);
    this.camera.lookAt(lookAt);
  }
}
