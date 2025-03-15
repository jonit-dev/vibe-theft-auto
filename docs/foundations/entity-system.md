# Entity System

## Overview

The Entity System forms the backbone of our game engine architecture, providing a flexible foundation for creating game objects. An entity can represent any game object, such as a player, NPC, vehicle, or interactive element in the game world.

The system follows a composition-based approach, allowing developers to build complex game objects by attaching various components to entities. This approach provides greater flexibility than inheritance-based systems and aligns with modern game development practices.

## Core Architecture

```typescript
// Base Entity class
class Entity {
  id: string;
  name: string;
  active: boolean = true;
  components: Map<ComponentType, Component> = new Map();
  tags: Set<string> = new Set();

  constructor(id: string, name?: string) {
    this.id = id;
    this.name = name || id;
  }

  // Add component to this entity
  addComponent<T extends Component>(
    componentType: new (...args: any[]) => T,
    ...args: any[]
  ): T {
    const component = new componentType(...args);
    component.entity = this;
    this.components.set(componentType, component);
    return component;
  }

  // Get component from this entity
  getComponent<T extends Component>(
    componentType: new (...args: any[]) => T
  ): T | null {
    return (this.components.get(componentType) as T) || null;
  }

  // Check if entity has a component
  hasComponent(componentType: new (...args: any[]) => Component): boolean {
    return this.components.has(componentType);
  }

  // Remove component from entity
  removeComponent(componentType: new (...args: any[]) => Component): boolean {
    const component = this.components.get(componentType);
    if (component) {
      component.destroy();
      return this.components.delete(componentType);
    }
    return false;
  }

  // Add a tag to this entity for filtering
  addTag(tag: string): void {
    this.tags.add(tag);
  }

  // Check if entity has a tag
  hasTag(tag: string): boolean {
    return this.tags.has(tag);
  }

  // Remove tag from this entity
  removeTag(tag: string): boolean {
    return this.tags.delete(tag);
  }

  // Update all components
  update(deltaTime: number): void {
    if (!this.active) return;

    for (const component of this.components.values()) {
      if (component.enabled) {
        component.update(deltaTime);
      }
    }
  }

  // Clean up all components when entity is destroyed
  destroy(): void {
    for (const component of this.components.values()) {
      component.destroy();
    }
    this.components.clear();
  }
}
```

## Entity Manager

```typescript
// Manages all entities in a scene
class EntityManager {
  private entities: Map<string, Entity> = new Map();
  private entitiesByTag: Map<string, Set<Entity>> = new Map();

  // Create a new entity
  createEntity(id?: string, name?: string): Entity {
    const entityId = id || generateUUID();
    const entity = new Entity(entityId, name);
    this.entities.set(entityId, entity);
    return entity;
  }

  // Get entity by ID
  getEntity(id: string): Entity | undefined {
    return this.entities.get(id);
  }

  // Get all entities with a specific tag
  getEntitiesByTag(tag: string): Set<Entity> {
    return this.entitiesByTag.get(tag) || new Set<Entity>();
  }

  // Get all entities with a specific component type
  getEntitiesByComponent<T extends Component>(
    componentType: new (...args: any[]) => T
  ): Entity[] {
    return Array.from(this.entities.values()).filter((entity) =>
      entity.hasComponent(componentType)
    );
  }

  // Remove an entity
  removeEntity(id: string): boolean {
    const entity = this.entities.get(id);
    if (entity) {
      // Remove from tag collections
      for (const tag of entity.tags) {
        const tagSet = this.entitiesByTag.get(tag);
        if (tagSet) {
          tagSet.delete(entity);
        }
      }

      // Destroy the entity
      entity.destroy();
      return this.entities.delete(id);
    }
    return false;
  }

  // Update all entities
  update(deltaTime: number): void {
    for (const entity of this.entities.values()) {
      entity.update(deltaTime);
    }
  }

  // Register tag for entity (internal use)
  registerEntityTag(entity: Entity, tag: string): void {
    if (!this.entitiesByTag.has(tag)) {
      this.entitiesByTag.set(tag, new Set<Entity>());
    }
    this.entitiesByTag.get(tag)!.add(entity);
  }

  // Unregister tag for entity (internal use)
  unregisterEntityTag(entity: Entity, tag: string): void {
    const tagSet = this.entitiesByTag.get(tag);
    if (tagSet) {
      tagSet.delete(entity);
    }
  }
}
```

## Component System

```typescript
// Base Component class
abstract class Component {
  entity: Entity | null = null;
  enabled: boolean = true;

  // Called when component is first added to an entity
  start(): void {}

  // Called every frame
  update(deltaTime: number): void {}

  // Called when component is removed or entity is destroyed
  destroy(): void {}
}

// Example component types
class TransformComponent extends Component {
  position: Vector3 = new Vector3(0, 0, 0);
  rotation: Quaternion = new Quaternion();
  scale: Vector3 = new Vector3(1, 1, 1);

  setPosition(x: number, y: number, z: number): this {
    this.position.set(x, y, z);
    return this;
  }

  // Additional transform methods...
}

class ModelComponent extends Component {
  mesh: THREE.Mesh | null = null;

  setModel(modelId: string): this {
    // Load model from resource manager
    // this.mesh = resourceManager.getModel(modelId);
    return this;
  }

  // Additional model methods...
}

class PhysicsComponent extends Component {
  velocity: Vector3 = new Vector3(0, 0, 0);
  mass: number = 1;

  update(deltaTime: number): void {
    if (this.entity) {
      const transform = this.entity.getComponent(TransformComponent);
      if (transform) {
        // Simple physics update
        transform.position.x += this.velocity.x * deltaTime;
        transform.position.y += this.velocity.y * deltaTime;
        transform.position.z += this.velocity.z * deltaTime;
      }
    }
  }

  // Additional physics methods...
}
```

## Usage Examples

### Creating a Player Entity

```typescript
// Create a player entity with multiple components
const player = entityManager.createEntity('player', 'Player');

// Add components
player.addComponent(TransformComponent).setPosition(0, 0, 0);

player.addComponent(ModelComponent).setModel('player_model');

player.addComponent(PhysicsComponent);

// Add a tag for easy filtering
player.addTag('player');
```

### Creating an NPC Entity

```typescript
// Create an NPC entity
const npc = entityManager.createEntity('npc1', 'Villager');

// Add components
npc.addComponent(TransformComponent).setPosition(10, 0, 5);

npc.addComponent(ModelComponent).setModel('villager_model');

// Add AI component
npc.addComponent(AIComponent).setAIType('villager');

// Add tag
npc.addTag('npc');
```

## Integration with Module System

The Entity System integrates with other modules in the following ways:

1. **Physics Module**: Entities can have physics-related components attached for physical simulation
2. **Rendering Module**: Model and transform components work with the rendering system
3. **Events Module**: Entities can publish and subscribe to events
4. **Input Module**: Player entities can have input handling components

## Future Enhancements

1. **Entity Component System (ECS)**: Migrate to a more data-oriented ECS approach for better performance
2. **Prefab System**: Allow for creation of entity templates/prefabs for reusable entity configurations
3. **Serialization**: Add serialization/deserialization support for saving entity state
4. **Hierarchical Entities**: Support parent-child relationships between entities
5. **Entity Pooling**: Implement entity pooling for frequently created/destroyed entities
