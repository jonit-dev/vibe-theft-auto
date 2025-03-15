import { Scene } from '@/core/Scene';
import { SceneManager } from '@/core/SceneManager';
import { CubeController } from '@/core/components/CubeController';
import { Rotator } from '@/core/components/Rotator';
import { RenderService } from '@modules/rendering/RenderService';
import * as THREE from 'three';
import { container, injectable, singleton } from 'tsyringe';

@injectable()
@singleton()
export class MainScene extends Scene {
  private sceneManager: SceneManager;
  private renderService: RenderService;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private backButton: THREE.Mesh | null = null;
  private resourceDemoButton: THREE.Mesh | null = null;

  constructor(sceneManager: SceneManager) {
    super();
    this.sceneManager = sceneManager;
    this.renderService = container.resolve(RenderService);
  }

  public onEnter(): void {
    console.log('Entered main scene');

    // Setup the scene
    this.setupScene();

    // Create back button
    this.createBackButton();

    // Setup event listener for mouse clicks
    document.addEventListener('click', this.onMouseClick.bind(this));
  }

  public onExit(): void {
    // Clean up
    document.removeEventListener('click', this.onMouseClick.bind(this));
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

    // Add resource demo button
    this.createResourceDemoButton();
  }

  private createCube(
    id: string,
    x: number,
    y: number,
    z: number,
    color: number
  ): void {
    // Create a game object
    const cubeObject = this.createGameObject(id);

    // Create a THREE.js mesh
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);

    // Add the mesh to the object3D
    cubeObject.getObject3D().add(mesh);

    // Set position
    cubeObject.getObject3D().position.set(x, y, z);

    // Add rotator component
    cubeObject
      .addComponent(Rotator)
      .setRotationSpeed(
        Math.random() * 0.01,
        Math.random() * 0.01,
        Math.random() * 0.01
      );
  }

  private createControllableCube(
    id: string,
    x: number,
    y: number,
    z: number,
    color: number
  ): void {
    // Create a game object
    const playerCube = this.createGameObject(id);

    // Create a THREE.js mesh
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);

    // Add the mesh to the object3D
    playerCube.getObject3D().add(mesh);

    // Set position
    playerCube.getObject3D().position.set(x, y, z);

    // Add controller component
    playerCube.addComponent(CubeController);
  }

  private addInstructions(): void {
    const instructionsDiv = document.createElement('div');
    instructionsDiv.style.position = 'absolute';
    instructionsDiv.style.bottom = '20px';
    instructionsDiv.style.left = '20px';
    instructionsDiv.style.color = 'white';
    instructionsDiv.style.fontFamily = 'Arial, sans-serif';
    instructionsDiv.style.padding = '10px';
    instructionsDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    instructionsDiv.style.borderRadius = '5px';
    instructionsDiv.innerHTML = `
      <h3>Main Scene Controls</h3>
      <p>Arrow keys / WASD: Move red cube</p>
      <p>Space: Toggle rotation</p>
    `;
    document.body.appendChild(instructionsDiv);
  }

  /**
   * Create a back button to return to intro screen
   */
  private createBackButton(): void {
    // Create a canvas for the button
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = 256;
    canvas.height = 64;

    // Style the button
    context.fillStyle = '#2c3e50';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = '#e74c3c';
    context.lineWidth = 4;
    context.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
    context.font = 'Bold 24px Arial';
    context.fillStyle = '#ecf0f1';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('Back to Intro', canvas.width / 2, canvas.height / 2);

    // Create a texture from the canvas
    const texture = new THREE.CanvasTexture(canvas);

    // Create a plane with the texture
    this.backButton = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 0.5),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true })
    );

    // Position the button at the top-right corner
    this.backButton.position.set(6, 4, 0);
    this.getThreeScene().add(this.backButton);
  }

  /**
   * Create a button to navigate to the resource demo scene
   */
  private createResourceDemoButton(): void {
    // Create a canvas for the button
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = 256;
    canvas.height = 64;

    // Style the button
    context.fillStyle = '#2c3e50';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = '#2ecc71';
    context.lineWidth = 4;
    context.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
    context.font = 'Bold 20px Arial';
    context.fillStyle = '#ecf0f1';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('Resource Demo', canvas.width / 2, canvas.height / 2);

    // Create a texture from the canvas
    const texture = new THREE.CanvasTexture(canvas);

    // Create a plane with the texture
    const button = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 0.5),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true })
    );

    // Position the button below the back button
    button.position.set(6, 3.3, 0);
    this.getThreeScene().add(button);

    // Store reference for raycasting
    this.resourceDemoButton = button;
  }

  /**
   * Handle mouse clicks
   */
  private onMouseClick(event: MouseEvent): void {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Use the camera from RenderService directly
    const camera = this.renderService.getCamera();

    this.raycaster.setFromCamera(this.mouse, camera);

    // Check if back button was clicked
    if (this.backButton) {
      const intersects = this.raycaster.intersectObject(this.backButton);
      if (intersects.length > 0) {
        console.log('Back button clicked, returning to intro screen');
        this.sceneManager.switchScene('intro');
      }
    }

    // Check if resource demo button was clicked
    if (this.resourceDemoButton) {
      const intersectsResourceDemo = this.raycaster.intersectObject(
        this.resourceDemoButton
      );
      if (intersectsResourceDemo.length > 0) {
        console.log(
          'Resource demo button clicked, going to resource demo scene'
        );
        this.sceneManager.switchScene('resource-demo');
      }
    }
  }
}
