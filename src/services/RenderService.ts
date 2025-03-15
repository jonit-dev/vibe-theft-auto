import * as THREE from 'three';
import { injectable, singleton } from 'tsyringe';
import { Scene } from '../core/Scene';

@injectable()
@singleton()
export class RenderService {
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private initialized: boolean = false;

  constructor() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

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

  public render(scene: Scene | null): void {
    if (!scene || !this.initialized) return;

    this.renderer.render(scene.getThreeScene(), this.camera);
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  private onResize(): void {
    if (!this.initialized) return;

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
