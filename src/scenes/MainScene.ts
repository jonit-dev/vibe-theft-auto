import * as THREE from 'three';
import { injectable } from 'tsyringe';
import { BaseScene } from './BaseScene';

@injectable()
export class MainScene extends BaseScene {
  private cube: THREE.Mesh;

  constructor() {
    super();

    // Create a simple cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
    });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
  }

  public onEnter(): void {
    console.log('Entered Main Scene');
  }

  public onExit(): void {
    console.log('Exited Main Scene');
  }

  public update(deltaTime: number): void {
    // Rotate the cube
    this.cube.rotation.x += 0.5 * deltaTime;
    this.cube.rotation.y += 0.5 * deltaTime;
  }
}
