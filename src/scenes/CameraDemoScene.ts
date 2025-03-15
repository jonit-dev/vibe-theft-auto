import { Scene } from '@/core/Scene';
import { CameraService, FirstPersonCamera, OrbitCamera } from '@modules/camera';
import { EventBus } from '@modules/events/EventBus';
import { InputManager } from '@modules/input/InputManager';
import { PlayerMovementComponent } from '@modules/physics/components/PlayerMovementComponent';
import { RenderService } from '@modules/rendering/RenderService';
import * as THREE from 'three';
import { injectable, singleton } from 'tsyringe';

@injectable()
@singleton()
export class CameraDemoScene extends Scene {
  private cameraService: CameraService;
  private renderService: RenderService;
  private eventBus: EventBus;
  private inputManager: InputManager;

  private playerObject: THREE.Mesh;
  private cubes: THREE.Mesh[] = [];
  private controls: THREE.Group;
  private canvas: HTMLCanvasElement;
  private instructionsDiv: HTMLDivElement | null = null;
  private cameraSwitchButtons: HTMLDivElement | null = null;
  private activeCamera: string = 'follow';

  constructor(
    cameraService: CameraService,
    renderService: RenderService,
    eventBus: EventBus,
    inputManager: InputManager
  ) {
    super();
    this.cameraService = cameraService;
    this.renderService = renderService;
    this.eventBus = eventBus;
    this.inputManager = inputManager;

    // Get the canvas from the render service
    this.canvas = this.renderService.getRenderer().domElement;

    // Create a player mesh
    const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
    const playerMaterial = new THREE.MeshStandardMaterial({ color: 0x3399ff });
    this.playerObject = new THREE.Mesh(playerGeometry, playerMaterial);
    this.playerObject.position.set(0, 1, 0);
    this.playerObject.castShadow = true;

    // Create UI controls
    this.controls = new THREE.Group();
  }

  public onEnter(): void {
    // Set up scene
    this.setupScene();

    // Create a game object for the player
    const playerGameObject = this.createGameObject('player');

    // Add the playerObject to the game object's Object3D
    playerGameObject.getObject3D().position.copy(this.playerObject.position);

    // Add the player mesh as a child of the game object's Object3D
    playerGameObject.getObject3D().add(this.playerObject);

    // Add movement component to the player
    const playerMovement = playerGameObject.addComponent(
      PlayerMovementComponent
    );
    playerMovement.setMoveSpeed(8);
    playerMovement.setJumpForce(10);
    playerMovement.setGravity(25);

    // Set up cameras
    this.setupCameras();

    // Set up input handling
    this.setupInputHandling();

    // Add UI elements
    this.createUI();

    // Add event listener for canvas resize
    window.addEventListener('resize', this.onResize.bind(this));
  }

  public onExit(): void {
    // Remove event listeners
    window.removeEventListener('resize', this.onResize.bind(this));

    // Remove UI elements
    if (this.instructionsDiv && this.instructionsDiv.parentNode) {
      this.instructionsDiv.parentNode.removeChild(this.instructionsDiv);
      this.instructionsDiv = null;
    }

    if (this.cameraSwitchButtons && this.cameraSwitchButtons.parentNode) {
      this.cameraSwitchButtons.parentNode.removeChild(this.cameraSwitchButtons);
      this.cameraSwitchButtons = null;
    }

    // Clear the scene
    this.disposeScene();
  }

  public update(deltaTime: number): void {
    super.update(deltaTime);

    // Update camera target if needed
    const activeCamera = this.cameraService.getActiveCamera();
    if (activeCamera) {
      if (activeCamera.getTarget() !== this.playerObject) {
        activeCamera.setTarget(this.playerObject);
      }

      // Update active camera indicator
      this.updateActiveCameraUI(activeCamera.getName());
    }
  }

  private setupScene(): void {
    // Create ground
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.8,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.getThreeScene().add(ground);

    // Add cubes as obstacles
    this.createCubes();

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    this.getThreeScene().add(ambientLight);

    // Add directional light
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(10, 10, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 50;
    dirLight.shadow.camera.left = -20;
    dirLight.shadow.camera.right = 20;
    dirLight.shadow.camera.top = 20;
    dirLight.shadow.camera.bottom = -20;
    this.getThreeScene().add(dirLight);

    // Enable shadows in the renderer
    this.renderService.getRenderer().shadowMap.enabled = true;
  }

  private createCubes(): void {
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);

    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 40 - 20;
      const z = Math.random() * 40 - 20;

      // Don't place cubes too close to the player
      if (Math.abs(x) < 3 && Math.abs(z) < 3) continue;

      const material = new THREE.MeshStandardMaterial({
        color: Math.random() * 0xffffff,
        roughness: 0.7,
        metalness: 0.2,
      });

      const cube = new THREE.Mesh(cubeGeometry, material);
      cube.position.set(x, 1, z);
      cube.castShadow = true;
      cube.receiveShadow = true;

      this.getThreeScene().add(cube);
      this.cubes.push(cube);
    }
  }

  private setupCameras(): void {
    // Create a follow camera
    const followCamera = this.cameraService.createCamera('follow', 'follow', {
      offset: new THREE.Vector3(0, 3, 5),
      damping: 5,
    });
    followCamera.setTarget(this.playerObject);

    // Create an orbit camera
    const orbitCamera = this.cameraService.createCamera('orbit', 'orbit', {
      radius: 10,
      initialPhi: Math.PI / 4,
    });
    orbitCamera.setTarget(this.playerObject);

    // Create a first-person camera
    const firstPersonCamera = this.cameraService.createCamera(
      'firstPerson',
      'firstPerson',
      {
        offset: new THREE.Vector3(0, 1.6, 0),
        sensitivity: 0.2,
      }
    );
    firstPersonCamera.setTarget(this.playerObject);

    // Set the follow camera as active by default
    this.cameraService.setActiveCamera('follow');
    this.activeCamera = 'follow';
  }

  private createUI(): void {
    // Create instructions div
    this.instructionsDiv = document.createElement('div');
    this.instructionsDiv.style.position = 'absolute';
    this.instructionsDiv.style.bottom = '20px';
    this.instructionsDiv.style.left = '20px';
    this.instructionsDiv.style.color = 'white';
    this.instructionsDiv.style.fontFamily = 'Arial, sans-serif';
    this.instructionsDiv.style.padding = '10px';
    this.instructionsDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    this.instructionsDiv.style.borderRadius = '5px';
    this.instructionsDiv.style.maxWidth = '400px';
    this.instructionsDiv.innerHTML = `
      <h3 style="margin: 0 0 10px 0;">Camera Demo Controls</h3>
      <p style="margin: 5px 0;"><b>WASD</b>: Move player</p>
      <p style="margin: 5px 0;"><b>SPACE</b>: Jump</p>
      <p style="margin: 5px 0;"><b>1</b>: Switch to Follow Camera</p>
      <p style="margin: 5px 0;"><b>2</b>: Switch to Orbit Camera (drag mouse to rotate)</p>
      <p style="margin: 5px 0;"><b>3</b>: Switch to First-Person Camera (drag mouse to look around)</p>
      <p style="margin: 5px 0;"><b>Mouse Wheel</b>: Zoom in/out (Orbit Camera only)</p>
      <p style="margin: 5px 0;"><b>ESC</b>: Return to main scene</p>
    `;
    document.body.appendChild(this.instructionsDiv);

    // Create camera switching buttons
    this.cameraSwitchButtons = document.createElement('div');
    this.cameraSwitchButtons.style.position = 'absolute';
    this.cameraSwitchButtons.style.top = '20px';
    this.cameraSwitchButtons.style.right = '20px';
    this.cameraSwitchButtons.style.display = 'flex';
    this.cameraSwitchButtons.style.flexDirection = 'column';
    this.cameraSwitchButtons.style.gap = '10px';
    document.body.appendChild(this.cameraSwitchButtons);

    // Create a back button
    const backButton = this.createButton('Back to Main', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));
    });
    this.cameraSwitchButtons.appendChild(backButton);

    // Create a separator
    const separator = document.createElement('div');
    separator.style.height = '1px';
    separator.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    separator.style.margin = '5px 0';
    this.cameraSwitchButtons.appendChild(separator);

    // Create camera buttons
    const followButton = this.createCameraButton('Follow Camera (1)', 'follow');
    const orbitButton = this.createCameraButton('Orbit Camera (2)', 'orbit');
    const fpButton = this.createCameraButton('First Person (3)', 'firstPerson');

    this.cameraSwitchButtons.appendChild(followButton);
    this.cameraSwitchButtons.appendChild(orbitButton);
    this.cameraSwitchButtons.appendChild(fpButton);
  }

  private createButton(label: string, onClick: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = label;
    button.style.padding = '10px 15px';
    button.style.backgroundColor = '#2c3e50';
    button.style.color = 'white';
    button.style.border = '2px solid #34495e';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.fontWeight = 'bold';
    button.style.transition = 'background-color 0.2s';

    button.addEventListener('mouseover', () => {
      button.style.backgroundColor = '#34495e';
    });

    button.addEventListener('mouseout', () => {
      button.style.backgroundColor = '#2c3e50';
    });

    button.addEventListener('click', onClick);

    return button;
  }

  private createCameraButton(
    label: string,
    cameraName: string
  ): HTMLButtonElement {
    const button = this.createButton(label, () => {
      this.cameraService.transitionTo(cameraName, 1.0);
    });

    // Add ID for updating active state
    button.id = `camera-button-${cameraName}`;

    if (cameraName === this.activeCamera) {
      button.style.backgroundColor = '#3498db';
      button.style.borderColor = '#2980b9';
    }

    return button;
  }

  private updateActiveCameraUI(cameraName: string): void {
    if (this.activeCamera === cameraName) return;

    this.activeCamera = cameraName;

    // Reset all buttons
    if (this.cameraSwitchButtons) {
      const buttons = this.cameraSwitchButtons.querySelectorAll('button');
      buttons.forEach((button) => {
        button.style.backgroundColor = '#2c3e50';
        button.style.borderColor = '#34495e';
      });

      // Highlight active button
      const activeButton = document.getElementById(
        `camera-button-${cameraName}`
      );
      if (activeButton) {
        activeButton.style.backgroundColor = '#3498db';
        activeButton.style.borderColor = '#2980b9';
      }
    }
  }

  private setupInputHandling(): void {
    // Set up keyboard controls for camera switching
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Digit1') {
        this.cameraService.transitionTo('follow', 1.0);
      } else if (event.code === 'Digit2') {
        this.cameraService.transitionTo('orbit', 1.0);
      } else if (event.code === 'Digit3') {
        this.cameraService.transitionTo('firstPerson', 1.0);
      } else if (event.code === 'Escape') {
        // Add a way to go back to the main scene
        this.eventBus.emit('scene:switch', 'main');
      }
    });

    // Set up mouse handlers for orbit camera
    this.canvas.addEventListener('mousedown', this.handleMouseEvent.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseEvent.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseEvent.bind(this));
    this.canvas.addEventListener('wheel', this.handleMouseEvent.bind(this));
  }

  private handleMouseEvent(event: MouseEvent | WheelEvent): void {
    const activeCamera = this.cameraService.getActiveCamera();

    if (activeCamera instanceof OrbitCamera) {
      activeCamera.handleInput(event, this.canvas);
    } else if (
      activeCamera instanceof FirstPersonCamera &&
      event instanceof MouseEvent
    ) {
      activeCamera.handleInput(event, this.canvas);
    }
  }

  private disposeScene(): void {
    // Remove all event listeners
    this.canvas.removeEventListener(
      'mousedown',
      this.handleMouseEvent.bind(this)
    );
    this.canvas.removeEventListener(
      'mouseup',
      this.handleMouseEvent.bind(this)
    );
    this.canvas.removeEventListener(
      'mousemove',
      this.handleMouseEvent.bind(this)
    );
    this.canvas.removeEventListener('wheel', this.handleMouseEvent.bind(this));

    // Dispose geometries and materials
    this.playerObject.geometry.dispose();
    (this.playerObject.material as THREE.Material).dispose();

    for (const cube of this.cubes) {
      cube.geometry.dispose();
      (cube.material as THREE.Material).dispose();
    }

    this.cubes = [];
  }

  private onResize(): void {
    // Update camera aspect ratios
    const cameras = this.cameraService.getAllCameras();
    for (const camera of cameras.values()) {
      const threeCamera = camera.getThreeCamera();
      if (threeCamera instanceof THREE.PerspectiveCamera) {
        threeCamera.aspect = window.innerWidth / window.innerHeight;
        threeCamera.updateProjectionMatrix();
      }
    }
  }
}
