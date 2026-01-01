import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EntityRepository } from './entityRepository';
import { Entity } from '../entities/Entity';
import { Emitter } from '@pawel-kuznik/iventy';

// Mock Entity class for testing
class TestEntity extends Entity {
    constructor(public name: string, id?: string) {
        super(id);
    }
}

describe('EntityRepository', () => {
    let repository: EntityRepository<TestEntity>;
    let entity1: TestEntity;
    let entity2: TestEntity;
    let entity3: TestEntity;

    beforeEach(() => {
        repository = new EntityRepository<TestEntity>();
        entity1 = new TestEntity('Entity 1', 'id-1');
        entity2 = new TestEntity('Entity 2', 'id-2');
        entity3 = new TestEntity('Entity 3', 'id-3');
    });

    describe('constructor', () => {
        it('should create an empty repository with default event tag', () => {
            const repo = new EntityRepository<TestEntity>();
            expect(repo.getAllEntities()).toEqual([]);
        });

        it('should create a repository with custom event tag', () => {
            const repo = new EntityRepository<TestEntity>('custom-tag');
            expect(repo.getAllEntities()).toEqual([]);
        });
    });

    describe('getEntity', () => {
        it('should return undefined for non-existent entity', () => {
            expect(repository.getEntity('non-existent')).toBeUndefined();
        });

        it('should return the entity when it exists', () => {
            repository.insertEntity(entity1);
            const retrieved = repository.getEntity('id-1');
            expect(retrieved).toBe(entity1);
            expect(retrieved?.name).toBe('Entity 1');
        });

        it('should return undefined after entity is removed', () => {
            repository.insertEntity(entity1);
            repository.removeEntity(entity1);
            expect(repository.getEntity('id-1')).toBeUndefined();
        });
    });

    describe('getAllEntities', () => {
        it('should return empty array for empty repository', () => {
            expect(repository.getAllEntities()).toEqual([]);
        });

        it('should return all entities in the repository', () => {
            repository.insertEntity(entity1);
            repository.insertEntity(entity2);
            repository.insertEntity(entity3);

            const allEntities = repository.getAllEntities();
            expect(allEntities).toHaveLength(3);
            expect(allEntities).toContain(entity1);
            expect(allEntities).toContain(entity2);
            expect(allEntities).toContain(entity3);
        });

        it('should return a readonly array', () => {
            repository.insertEntity(entity1);
            const allEntities = repository.getAllEntities();
            expect(() => {
                (allEntities as TestEntity[]).push(entity2);
            }).not.toThrow();
            // But the original repository should not be modified
            expect(repository.getAllEntities()).toHaveLength(1);
        });

        it('should return updated entities after insertion', () => {
            expect(repository.getAllEntities()).toHaveLength(0);
            repository.insertEntity(entity1);
            expect(repository.getAllEntities()).toHaveLength(1);
            repository.insertEntity(entity2);
            expect(repository.getAllEntities()).toHaveLength(2);
        });

        it('should return updated entities after removal', () => {
            repository.insertEntity(entity1);
            repository.insertEntity(entity2);
            repository.insertEntity(entity3);
            expect(repository.getAllEntities()).toHaveLength(3);

            repository.removeEntity(entity2);
            const allEntities = repository.getAllEntities();
            expect(allEntities).toHaveLength(2);
            expect(allEntities).toContain(entity1);
            expect(allEntities).toContain(entity3);
            expect(allEntities).not.toContain(entity2);
        });
    });

    describe('insertEntity', () => {
        it('should insert an entity into the repository', () => {
            repository.insertEntity(entity1);
            expect(repository.getEntity('id-1')).toBe(entity1);
        });

        it('should return the repository instance for chaining', () => {
            const result = repository.insertEntity(entity1);
            expect(result).toBe(repository);
        });

        it('should overwrite existing entity with same ID', () => {
            repository.insertEntity(entity1);
            const newEntity = new TestEntity('Updated Entity', 'id-1');
            repository.insertEntity(newEntity);
            
            expect(repository.getAllEntities()).toHaveLength(1);
            expect(repository.getEntity('id-1')).toBe(newEntity);
            expect(repository.getEntity('id-1')?.name).toBe('Updated Entity');
        });

        it('should emit entity.added event when entity is inserted', () => {
            const eventHandler = vi.fn();
            repository.on('inserted', eventHandler);

            repository.insertEntity(entity1);

            expect(eventHandler).toHaveBeenCalledTimes(1);
        });

        it('should emit event with custom event tag', () => {
            const customRepo = new EntityRepository<TestEntity>('task');
            const eventHandler = vi.fn();
            customRepo.on('inserted.task', eventHandler);

            customRepo.insertEntity(entity1);

            expect(eventHandler).toHaveBeenCalledTimes(1);
        });

        it('should emit event even when overwriting existing entity', () => {
            repository.insertEntity(entity1);
            const eventHandler = vi.fn();
            repository.on('inserted', eventHandler);

            const newEntity = new TestEntity('Updated Entity', 'id-1');
            repository.insertEntity(newEntity);

            expect(eventHandler).toHaveBeenCalledTimes(1);
        });
    });

    describe('removeEntity', () => {
        beforeEach(() => {
            repository.insertEntity(entity1);
            repository.insertEntity(entity2);
            repository.insertEntity(entity3);
        });

        it('should remove an entity by entity object', () => {
            repository.removeEntity(entity1);
            expect(repository.getEntity('id-1')).toBeUndefined();
            expect(repository.getAllEntities()).toHaveLength(2);
        });

        it('should remove an entity by ID string', () => {
            repository.removeEntity('id-2');
            expect(repository.getEntity('id-2')).toBeUndefined();
            expect(repository.getAllEntities()).toHaveLength(2);
        });

        it('should return the repository instance for chaining', () => {
            const result = repository.removeEntity(entity1);
            expect(result).toBe(repository);
        });

        it('should not throw when removing non-existent entity', () => {
            expect(() => {
                repository.removeEntity('non-existent');
            }).not.toThrow();
        });

        it('should not throw when removing non-existent entity object', () => {
            const nonExistentEntity = new TestEntity('Non-existent', 'non-existent-id');
            expect(() => {
                repository.removeEntity(nonExistentEntity);
            }).not.toThrow();
        });

        it('should emit entity.removed event when entity is removed by object', () => {
            const eventHandler = vi.fn();
            repository.on('removed.entity', eventHandler);

            repository.removeEntity(entity1);

            expect(eventHandler).toHaveBeenCalledTimes(1);
        });

        it('should emit entity.removed event when entity is removed by ID', () => {
            const eventHandler = vi.fn();
            repository.on('removed.entity', eventHandler);

            repository.removeEntity('id-2');

            expect(eventHandler).toHaveBeenCalledTimes(1);
        });

        it('should emit event with custom event tag', () => {
            const customRepo = new EntityRepository<TestEntity>('project');
            customRepo.insertEntity(entity1);
            const eventHandler = vi.fn();
            customRepo.on('removed.project', eventHandler);

            customRepo.removeEntity(entity1);

            expect(eventHandler).toHaveBeenCalledTimes(1);
        });

        it('should not emit event when removing non-existent entity', () => {
            const eventHandler = vi.fn();
            repository.on('removed.entity', eventHandler);

            repository.removeEntity('non-existent');

            expect(eventHandler).toHaveBeenCalledTimes(0);
        });
    });

    describe('integration scenarios', () => {
        it('should handle complete entity lifecycle', () => {
            const addedEvents: any[] = [];
            const removedEvents: any[] = [];

            repository.on('inserted.entity', (data) => {
                addedEvents.push(data);
            });
            repository.on('removed.entity', (data) => {
                removedEvents.push(data);
            });

            // Insert entities
            repository.insertEntity(entity1);
            repository.insertEntity(entity2);
            repository.insertEntity(entity3);

            expect(repository.getAllEntities()).toHaveLength(3);
            expect(addedEvents).toHaveLength(3);

            // Remove entities
            repository.removeEntity(entity1);
            repository.removeEntity('id-2');

            expect(repository.getAllEntities()).toHaveLength(1);
            expect(repository.getEntity('id-3')).toBe(entity3);
            expect(removedEvents).toHaveLength(2);
        });

        it('should handle chaining methods', () => {
            repository
                .insertEntity(entity1)
                .insertEntity(entity2)
                .on('entity.added.entity', vi.fn())
                .removeEntity(entity1)
                .bubbleTo(new Emitter());

            expect(repository.getAllEntities()).toHaveLength(1);
            expect(repository.getEntity('id-2')).toBe(entity2);
        });

        it('should handle multiple repositories with different event tags', () => {
            const taskRepo = new EntityRepository<TestEntity>('task');
            const projectRepo = new EntityRepository<TestEntity>('project');

            const taskHandler = vi.fn();
            const projectHandler = vi.fn();

            taskRepo.on('inserted.task', taskHandler);
            projectRepo.on('inserted.project', projectHandler);

            taskRepo.insertEntity(entity1);
            projectRepo.insertEntity(entity2);

            expect(taskHandler).toHaveBeenCalledTimes(1);
            expect(projectHandler).toHaveBeenCalledTimes(1);
        });
    });
});

