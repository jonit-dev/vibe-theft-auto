import * as THREE from 'three';
import { injectable, singleton } from 'tsyringe';
import { Scene } from '../core/Scene';
import { CubeController } from '../core/components/CubeController';
import { Rotator } from '../core/components/Rotator';
import { Transform } from '../core/components/Transform';

@injectable()
@singleton()
export class MainScene extends Scene {
  constructor() {
    super();
    this.setupScene();
  }

  private setupScene(): void {
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.getThreeScene().add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    this.getThreeScene().add(directionalLight);

    // Create basic cubes
    this.createCube('cube1', 0, 0, 0, 0x44aa88);
    this.createCube('cube2', 2, 0, 0, 0x8844aa);
    this.createCube('cube3', -2, 0, 0, 0xaa8844);

    // Create a controllable cube
    this.createControllableCube('playerCube', 0, 2, 0, 0xff2266);

    // Add instructions to the page
    this.addInstructions();
  }

  private createCube(
    id: string,
    x: number,
    y: number,
    z: number,
    color: number
  ): void {
    // Create a new game object
    const cubeObject = this.createGameObject(id);

    // Get the Three.js Object3D
    const object3D = cubeObject.getObject3D();

    // Create a mesh and add it to the object
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    object3D.add(mesh);

    // Add a transform component
    const transform = cubeObject.addComponent(Transform);
    transform.setPosition(x, y, z);

    // Add a rotator component to make the cube rotate
    const rotator = cubeObject.addComponent(Rotator);
    rotator.setRotationSpeed(0, 1, 0); // Rotate around Y axis
  }

  private createControllableCube(
    id: string,
    x: number,
    y: number,
    z: number,
    color: number
  ): void {
    // Create a new game object
    const cubeObject = this.createGameObject(id);

    // Get the Three.js Object3D
    const object3D = cubeObject.getObject3D();

    // Create a mesh and add it to the object
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    object3D.add(mesh);

    // Add a transform component
    const transform = cubeObject.addComponent(Transform);
    transform.setPosition(x, y, z);

    // Add a rotator component (initially disabled)
    const rotator = cubeObject.addComponent(Rotator);
    rotator.setRotationSpeed(0, 2, 0);
    rotator.setEnabled(false);

    // Add a controller component
    cubeObject.addComponent(CubeController);
  }

  private addInstructions(): void {
    const instructions = document.createElement('div');
    instructions.style.position = 'absolute';
    instructions.style.top = '10px';
    instructions.style.left = '10px';
    instructions.style.color = 'white';
    instructions.style.fontFamily = 'Arial, sans-serif';
    instructions.style.fontSize = '14px';
    instructions.style.padding = '10px';
    instructions.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    instructions.style.borderRadius = '5px';

    instructions.innerHTML = `
      <h3>Controls:</h3>
      <p>Arrow Keys: Move the player cube</p>
      <p>Spacebar: Toggle rotation</p>
    `;

    document.body.appendChild(instructions);
  }

  public onEnter(): void {
    super.onEnter();
    console.log('Entered main scene');
  }

  public onExit(): void {
    super.onExit();
    console.log('Exited main scene');
  }
}
