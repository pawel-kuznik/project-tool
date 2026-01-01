import { v4 as uuidv4 } from 'uuid';
import { IdHolder } from '../interfaces/IdHolder';

/**
 *  Base class for all entities that need a unique identifier. Classes extending
 *  from this class will be managed by the Repository class.
 */
export abstract class Entity implements IdHolder {
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
