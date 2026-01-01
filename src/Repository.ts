import { TaskEntity } from './entities/TaskEntity';
import { Task } from './interfaces/Task';
import { EntityRepository } from './entityManagement/entityRepository';
import { EmitterLike, Emitter, EventHandler, EventHandlerUninstaller } from '@pawel-kuznik/iventy';

/**
 * Repository class for managing tasks, projects, and milestones
 */
export class Repository implements EmitterLike {

  /**
   * The event emitter instance.
   */
  private _emitter: Emitter = new Emitter();

  /**
   * The tasks repository instance.
   */
  private _tasks: EntityRepository<TaskEntity> = new EntityRepository<TaskEntity>();

  /**
   * Get all tasks in the repository.
   */
  getTasks(): readonly Task[] {
    return this._tasks.getAllEntities();
  }

  /**
   * Get a task by its ID.
   */
  getTask(id: string): Task | undefined {
    return this._tasks.getEntity(id);
  }

  /**
   * Create a new task.
   */
  createTask(): Task {
    const task = new TaskEntity();
    this._tasks.insertEntity(task);
    return task;
  }

  /**
   * Remove a task from the repository.
   */
  removeTask(task: Task|string): this {
    this._tasks.removeEntity(typeof task === 'string' ? task : task.id);
    return this;
  }

  /**
   * Handle an event.
   */
  handle(event: string, callback: EventHandler) : EventHandlerUninstaller {
    return this._emitter.handle(event, callback);
  }

  /**
   * Listen to an event.
   */
  on(event: string, callback: EventHandler) : this {
    this._emitter.on(event, callback);
    return this;
  }

  /**
   * Stop listening to an event.
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
