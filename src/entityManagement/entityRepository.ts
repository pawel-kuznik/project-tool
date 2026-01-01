import { Entity } from '../entities/Entity';
import { Emitter, EmitterLike, EventHandler, EventHandlerUninstaller } from '@pawel-kuznik/iventy';

/**
 * Repository for managing entities. This class will be used to create basic
 * management over tasks, projects, and milestones.
 * 
 * @todo should emit events when entities are added or removed from the repository.
 */
export class EntityRepository<T extends Entity> implements EmitterLike {

    /**
     * The event emitter instance.
     */
    private _emitter: Emitter = new Emitter();
    
    /**
     * The entities map.
     */
    private _entities: Map<string, T> = new Map();

    /**
     * The event tag for the repository.
     */
    private _eventTag: string = 'entity';

    /**
     * The constructor for the entity repository.
     */
    constructor(eventTag: string = 'entity') {
        this._eventTag = eventTag;
    }

    /**
     * Get an entity by its ID.
     */
    getEntity(id: string): T | undefined {
        return this._entities.get(id);
    }

    /**
     * Get all entities in the repository.
     */
    getAllEntities(): readonly T[] {
        return Array.from(this._entities.values());
    }

    /**
     * Insert an entity into the repository
     */
    insertEntity(entity: T): this {
        this._entities.set(entity.id, entity);
        this._emitter.trigger(`inserted.${this._eventTag}`, { entity });
        return this;
    }

    /**
     * Remove an entity from the repository
     */
    removeEntity(entity: T|string): this {
        const id = typeof entity === 'string' ? entity : entity.id;

        // if there is no entity with the given ID, do nothing
        if (!this._entities.has(id)) {
            return this;
        }

        this._entities.delete(id);
        this._emitter.trigger(`removed.${this._eventTag}`, { entity });
        return this;
    }

    /**
     * Handle an event.
     */
    handle(event: string, callback: EventHandler) : EventHandlerUninstaller {
        return this._emitter.handle(event, callback);
    }

    /**
     * Handle an event.
     */
    on(event: string, callback: EventHandler) : this {
        this._emitter.on(event, callback);
        return this;
    }

    /**
     * Handle an event.
     */
    off(event: string, callback: EventHandler) : this {
        this._emitter.off(event, callback);
        return this;
    }

    /**
     * Bubble the events to a parent emitter.
     */
    bubbleTo(emitter: Emitter) : this {
        this._emitter.bubbleTo(emitter);
        return this;
    }
}