import { Counter } from './Counter';
import { Entity } from './Entity';

/**
 * Represents a task in the TODO system
 */
export class Task extends Entity {
  /**
   * Title of the task
   */
  public title: string;

  /**
   * Detailed description in markdown format
   */
  public description: string;

  /**
   * Creation date of the task
   */
  public date: Date;

  /**
   * Due date for the task
   */
  public duedate: Date | null;

  /**
   * Tags associated with the task
   */
  public tags: string[];

  /**
   * Current status of the task (configurable at various levels)
   */
  public status: string;

  /**
   * Counter tracking items in different states
   */
  public counter: Counter | null;

  /**
   * Array of project IDs that this task is attached to
   */
  public projects: string[];

  /**
   * Array of milestone IDs that this task is attached to
   */
  public milestones: string[];

  constructor(
    title: string,
    description: string = '',
    date: Date = new Date(),
    duedate: Date | null = null,
    tags: string[] = [],
    status: string = 'pending',
    counter: Counter | null = null,
    projects: string[] = [],
    milestones: string[] = [],
    id?: string
  ) {
    super(id);
    this.title = title;
    this.description = description;
    this.date = date;
    this.duedate = duedate;
    this.tags = tags;
    this.status = status;
    this.counter = counter;
    this.projects = projects;
    this.milestones = milestones;
  }
}
