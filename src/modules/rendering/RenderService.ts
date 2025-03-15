import { IScene } from '@core/interfaces/IScene';
import * as THREE from 'three';
import { injectable, singleton } from 'tsyringe';

@injectable()
@singleton()
export class RenderService {
  private renderer: THREE.WebGLRenderer;
  private defaultCamera: THREE.PerspectiveCamera;
  private initialized: boolean = false;

  constructor() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    this.defaultCamera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.defaultCamera.position.z = 5;

    // Handle window resize
    window.addEventListener('resize', this.onResize.bind(this));
  }

  public initialize(): void {
    if (this.initialized) return;

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(this.renderer.domElement);

    this.initialized = true;
  }

  /**
   * Render a scene with the specified camera
   * @param scene - The scene to render
   * @param camera - Optional camera to use (falls back to default camera)
   */
  public render(scene: IScene | null, camera?: THREE.Camera): void {
    if (!scene || !this.initialized) return;

    // Use the provided camera or fall back to the default camera
    const renderCamera = camera || this.defaultCamera;

    this.renderer.render(scene.getThreeScene(), renderCamera);
  }

  /**
   * Get the default camera
   */
  public getDefaultCamera(): THREE.PerspectiveCamera {
    return this.defaultCamera;
  }

  /**
   * Get the WebGL renderer
   */
  public getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  /**
   * Handle window resize events
   */
  private onResize(): void {
    if (!this.initialized) return;

    // Update default camera aspect ratio
    this.defaultCamera.aspect = window.innerWidth / window.innerHeight;
    this.defaultCamera.updateProjectionMatrix();

    // Resize renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
