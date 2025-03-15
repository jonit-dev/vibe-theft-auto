import { Component } from '@/core/Component';
import { IGameObject } from '@/core/interfaces/IGameObject';
import { EventBus } from '@modules/events/EventBus';
import { container } from 'tsyringe';

/**
 * A simple component that detects and emits collision events
 */
export class CollisionComponent extends Component {
  private eventBus: EventBus;
  private collisionRadius: number;
  private lastCollisionTime: number = 0;
  private collisionCooldown: number = 0.5; // seconds

  constructor(gameObject: IGameObject, radius: number = 1) {
    super(gameObject);
    this.eventBus = container.resolve(EventBus);
    this.collisionRadius = radius;
  }

  /**
   * Check for collisions with other game objects
   */
  update(deltaTime: number): void {
    if (!this.isEnabled()) return;

    // Only check for collisions after cooldown
    const currentTime = performance.now() / 1000;
    if (currentTime - this.lastCollisionTime < this.collisionCooldown) {
      return;
    }

    const myPosition = this.gameObject.getObject3D().position;
    const scene = this.gameObject.getScene();

    // This is a simplified collision detection
    // In a real game, you'd use a physics engine
    const gameObjects = scene.getAllGameObjects();

    for (const otherObject of gameObjects) {
      // Skip self
      if (otherObject.getId() === this.gameObject.getId()) continue;

      // Skip inactive objects
      if (!otherObject.isActive()) continue;

      // Skip objects without collision components
      const otherCollision = otherObject.getComponent(CollisionComponent);
      if (!otherCollision || !otherCollision.isEnabled()) continue;

      const otherPosition = otherObject.getObject3D().position;
      const distance = myPosition.distanceTo(otherPosition);

      // Check if objects are colliding
      if (distance < this.collisionRadius + otherCollision.getRadius()) {
        // Emit collision event with both objects
        this.eventBus.emit('collision', this.gameObject, otherObject);
        this.lastCollisionTime = currentTime;
      }
    }
  }

  /**
   * Get the collision radius
   */
  getRadius(): number {
    return this.collisionRadius;
  }

  /**
   * Set the collision radius
   */
  setRadius(radius: number): void {
    this.collisionRadius = radius;
  }
}
