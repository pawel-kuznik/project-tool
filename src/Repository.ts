import { TaskEntity } from './entities/TaskEntity';
import { Task } from './interfaces/Task';
import { EntityRepository } from './entityManagement/entityRepository';

/**
 * Repository class for managing tasks, projects, and milestones
 */
export class Repository {

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
}
