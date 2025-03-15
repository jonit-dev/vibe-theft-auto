import { Component } from '@/core/Component';
import { IGameObject } from '@/core/interfaces/IGameObject';
import { EventBus } from '@modules/events/EventBus';
import { container } from 'tsyringe';

/**
 * A component that listens for and responds to collision events
 */
export class CollisionHandlerComponent extends Component {
  private eventBus: EventBus;
  private handleCollision: (objectA: IGameObject, objectB: IGameObject) => void;

  constructor(
    gameObject: IGameObject,
    handler?: (objectA: IGameObject, objectB: IGameObject) => void
  ) {
    super(gameObject);
    this.eventBus = container.resolve(EventBus);

    // Default handler just logs the collision
    this.handleCollision =
      handler ||
      ((objectA, objectB) => {
        console.log(
          `Collision between ${objectA.getId()} and ${objectB.getId()}`
        );
      });
  }

  /**
   * Called when the component is first initialized
   */
  protected start(): void {
    // Register for collision events
    this.eventBus.on('collision', this.onCollision.bind(this));
  }

  /**
   * Called when the component is destroyed
   */
  destroy(): void {
    // Unregister from collision events
    this.eventBus.off('collision', this.onCollision.bind(this));
  }

  /**
   * Handle collision events
   */
  private onCollision(objectA: IGameObject, objectB: IGameObject): void {
    // Only handle collisions that involve this game object
    if (
      objectA.getId() === this.gameObject.getId() ||
      objectB.getId() === this.gameObject.getId()
    ) {
      this.handleCollision(objectA, objectB);
    }
  }

  /**
   * Change the collision handler
   */
  setCollisionHandler(
    handler: (objectA: IGameObject, objectB: IGameObject) => void
  ): void {
    this.handleCollision = handler;
  }
}
