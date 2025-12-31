import { v4 as uuidv4 } from 'uuid';

/**
 * Base class for all entities that need a unique identifier
 */
export abstract class Entity {
  /**
   * Unique identifier (UUID)
   */
  public readonly id: string;

  /**
   * Creates a new entity with a generated UUID or uses provided ID
   */
  constructor(id?: string) {
    this.id = id || uuidv4();
  }
}
