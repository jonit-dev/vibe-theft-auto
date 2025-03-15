import { Scene } from '@/core/Scene';
import { SceneManager } from '@/core/SceneManager';
import { InputManager } from '@/utils/InputManager';
import * as THREE from 'three';
import { injectable, singleton } from 'tsyringe';

@injectable()
@singleton()
export class IntroScene extends Scene {
  private sceneManager: SceneManager;
  private inputManager: InputManager;
  private demoButtons: { mesh: THREE.Mesh; scene: string; title: string }[] =
    [];
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  constructor(sceneManager: SceneManager, inputManager: InputManager) {
    super();
    this.sceneManager = sceneManager;
    this.inputManager = inputManager;
  }

  onEnter(): void {
    console.log('Entering IntroScene');

    // Setup lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.getThreeScene().add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    this.getThreeScene().add(directionalLight);

    // Add title text
    this.createTitleText();

    // Add demo scene buttons
    this.createDemoButton('eventDemo', 'Event System Demo', 0);
    this.createDemoButton('main', 'Main Scene Demo', 1);
    // Add more demo buttons here as we create them

    // Setup event listener for mouse clicks
    document.addEventListener('click', this.onMouseClick.bind(this));

    console.log('IntroScene setup complete. Click on a demo to start.');
  }

  onExit(): void {
    // Remove event listener when leaving the scene
    document.removeEventListener('click', this.onMouseClick.bind(this));
  }

  private createTitleText(): void {
    // Create a canvas for the text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = 512;
    canvas.height = 128;

    // Style the text
    context.fillStyle = '#000000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = 'Bold 48px Arial';
    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(
      'ThreeJS Game Engine',
      canvas.width / 2,
      canvas.height / 2
    );

    // Create a texture from the canvas
    const texture = new THREE.CanvasTexture(canvas);

    // Create a plane with the texture
    const titlePlane = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 1.25),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true })
    );

    titlePlane.position.set(0, 3, 0);
    this.getThreeScene().add(titlePlane);
  }

  private createDemoButton(
    sceneName: string,
    title: string,
    index: number
  ): void {
    // Create a canvas for the button
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = 512;
    canvas.height = 128;

    // Style the button
    context.fillStyle = '#2c3e50';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = '#3498db';
    context.lineWidth = 8;
    context.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
    context.font = 'Bold 36px Arial';
    context.fillStyle = '#ecf0f1';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(title, canvas.width / 2, canvas.height / 2);

    // Create a texture from the canvas
    const texture = new THREE.CanvasTexture(canvas);

    // Create a plane with the texture
    const buttonPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(4, 1),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true })
    );

    // Position the button based on index
    buttonPlane.position.set(0, 1 - index * 1.5, 0);
    this.getThreeScene().add(buttonPlane);

    // Store the button for click detection
    this.demoButtons.push({
      mesh: buttonPlane,
      scene: sceneName,
      title,
    });
  }

  private onMouseClick(event: MouseEvent): void {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    const camera = this.getThreeScene().getObjectByName(
      'camera'
    ) as THREE.Camera;
    if (!camera) return;

    this.raycaster.setFromCamera(this.mouse, camera);

    // Find intersections with demo buttons
    const buttonMeshes = this.demoButtons.map((button) => button.mesh);
    const intersects = this.raycaster.intersectObjects(buttonMeshes);

    if (intersects.length > 0) {
      // Find which button was clicked
      const clickedMesh = intersects[0].object;
      const buttonInfo = this.demoButtons.find(
        (button) => button.mesh === clickedMesh
      );

      if (buttonInfo) {
        console.log(`Switching to ${buttonInfo.title}`);
        this.sceneManager.switchScene(buttonInfo.scene);
      }
    }
  }

  update(deltaTime: number): void {
    super.update(deltaTime);

    // Add any animation or updates for the intro scene
    this.demoButtons.forEach((button) => {
      // Hover effect - slightly rotate the buttons
      button.mesh.rotation.y = Math.sin(performance.now() / 2000) * 0.05;
    });
  }
}
