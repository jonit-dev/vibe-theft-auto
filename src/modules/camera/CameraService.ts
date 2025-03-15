import * as THREE from 'three';
import { injectable, singleton } from 'tsyringe';
import { Camera } from './Camera';
import { CinematicCamera } from './CinematicCamera';
import { FirstPersonCamera } from './FirstPersonCamera';
import { FollowCamera } from './FollowCamera';
import { OrbitCamera } from './OrbitCamera';

export interface CameraTransitionOptions {
  duration: number;
  easing?: (t: number) => number;
}

/**
 * Class to handle transitions between cameras
 */
class CameraTransition {
  private sourceCamera: Camera;
  private targetCamera: Camera;
  private duration: number;
  private elapsed: number = 0;
  private easing: (t: number) => number;
  private tempPosition: THREE.Vector3 = new THREE.Vector3();
  private tempQuaternion: THREE.Quaternion = new THREE.Quaternion();

  constructor(
    sourceCamera: Camera,
    targetCamera: Camera,
    options: CameraTransitionOptions
  ) {
    this.sourceCamera = sourceCamera;
    this.targetCamera = targetCamera;
    this.duration = options.duration;
    this.easing = options.easing || ((t) => t); // Linear easing by default
  }

  /**
   * Update the transition
   * @param deltaTime - Time in seconds since the last frame
   * @returns Whether the transition is complete
   */
  public update(deltaTime: number): boolean {
    this.elapsed += deltaTime;

    // Calculate progress (0 to 1)
    const t = Math.min(1.0, this.elapsed / this.duration);

    // Apply easing
    const easedT = this.easing(t);

    // Get the source and target cameras
    const sourceThree = this.sourceCamera.getThreeCamera();
    const targetThree = this.targetCamera.getThreeCamera();

    // Interpolate position
    this.tempPosition.lerpVectors(
      sourceThree.position,
      targetThree.position,
      easedT
    );

    // Interpolate rotation (quaternion)
    this.tempQuaternion.slerpQuaternions(
      sourceThree.quaternion,
      targetThree.quaternion,
      easedT
    );

    // Apply to target camera
    targetThree.position.copy(this.tempPosition);
    targetThree.quaternion.copy(this.tempQuaternion);

    // Return true when complete
    return t >= 1.0;
  }

  /**
   * Get the target camera
   */
  public getTargetCamera(): Camera {
    return this.targetCamera;
  }
}

/**
 * Camera service to manage and switch between different camera types
 */
@injectable()
@singleton()
export class CameraService {
  private cameras: Map<string, Camera> = new Map();
  private activeCamera: Camera | null = null;
  private transitions: CameraTransition[] = [];
  private eventCallbacks: Map<string, Function[]> = new Map();

  constructor() {}

  /**
   * Register a camera with the service
   * @param name - Unique name for the camera
   * @param camera - The camera instance
   */
  public registerCamera(name: string, camera: Camera): void {
    camera.setName(name);
    this.cameras.set(name, camera);

    // If this is the first camera, make it active
    if (this.cameras.size === 1 && !this.activeCamera) {
      this.setActiveCamera(name);
    }
  }

  /**
   * Create a new camera of the specified type
   * @param name - Unique name for the camera
   * @param type - Type of camera to create
   * @param options - Camera options
   */
  public createCamera(
    name: string,
    type: 'follow' | 'orbit' | 'firstPerson' | 'cinematic',
    options: any = {}
  ): Camera {
    let camera: Camera;

    switch (type) {
      case 'follow':
        camera = new FollowCamera(options);
        break;
      case 'orbit':
        camera = new OrbitCamera(options);
        break;
      case 'firstPerson':
        camera = new FirstPersonCamera(options);
        break;
      case 'cinematic':
        camera = new CinematicCamera(options);
        break;
      default:
        throw new Error(`Unsupported camera type: ${type}`);
    }

    this.registerCamera(name, camera);
    return camera;
  }

  /**
   * Set the active camera
   * @param name - Name of the camera to set as active
   */
  public setActiveCamera(name: string): void {
    if (!this.cameras.has(name)) {
      console.warn(`Camera with name "${name}" does not exist`);
      return;
    }

    const prevCamera = this.activeCamera;
    this.activeCamera = this.cameras.get(name)!;

    this.trigger('camera.changed', this.activeCamera, prevCamera);
  }

  /**
   * Get the active camera
   */
  public getActiveCamera(): Camera | null {
    return this.activeCamera;
  }

  /**
   * Get a camera by name
   * @param name - Name of the camera to get
   */
  public getCamera(name: string): Camera | undefined {
    return this.cameras.get(name);
  }

  /**
   * Get all registered cameras
   */
  public getAllCameras(): Map<string, Camera> {
    return this.cameras;
  }

  /**
   * Remove a camera from the service
   * @param name - Name of the camera to remove
   */
  public removeCamera(name: string): void {
    if (!this.cameras.has(name)) {
      return;
    }

    // If this is the active camera, clear it
    if (this.activeCamera === this.cameras.get(name)) {
      this.activeCamera = null;
    }

    this.cameras.delete(name);

    // If we removed the active camera but have others, make another one active
    if (!this.activeCamera && this.cameras.size > 0) {
      const firstCameraKey = Array.from(this.cameras.keys())[0];
      if (firstCameraKey) {
        this.setActiveCamera(firstCameraKey);
      }
    }
  }

  /**
   * Transition smoothly from the current camera to another
   * @param name - Name of the camera to transition to
   * @param options - Transition options
   */
  public transitionTo(
    name: string,
    options: CameraTransitionOptions | number = 1.0
  ): void {
    if (!this.cameras.has(name)) {
      console.warn(`Camera with name "${name}" does not exist`);
      return;
    }

    if (!this.activeCamera) {
      this.setActiveCamera(name);
      return;
    }

    // If we're already transitioning to this camera, do nothing
    for (const transition of this.transitions) {
      if (transition.getTargetCamera().getName() === name) {
        return;
      }
    }

    // Convert number to options object
    const transitionOptions: CameraTransitionOptions =
      typeof options === 'number' ? { duration: options } : options;

    const targetCamera = this.cameras.get(name)!;

    // Create a new transition
    const transition = new CameraTransition(
      this.activeCamera,
      targetCamera,
      transitionOptions
    );

    this.transitions.push(transition);
    this.trigger('camera.transition.start', this.activeCamera, targetCamera);
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
   * Update all cameras and transitions
   * @param deltaTime - Time in seconds since the last frame
   */
  public update(deltaTime: number): void {
    // Update all cameras (even non-active ones)
    for (const camera of this.cameras.values()) {
      camera.update(deltaTime);
    }

    // Process transitions
    for (let i = this.transitions.length - 1; i >= 0; i--) {
      const transition = this.transitions[i];
      const isComplete = transition.update(deltaTime);

      if (isComplete) {
        // Set the target camera as active
        this.setActiveCamera(transition.getTargetCamera().getName());

        // Remove the completed transition
        this.transitions.splice(i, 1);

        this.trigger('camera.transition.complete', this.activeCamera);
      }
    }
  }

  /**
   * Get the Three.js camera for rendering
   */
  public getThreeCamera(): THREE.Camera | null {
    return this.activeCamera ? this.activeCamera.getThreeCamera() : null;
  }
}
