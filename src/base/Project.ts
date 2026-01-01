import { Entity } from '../entities/Entity';

/**
 * Represents a project that contains tasks
 */
export class Project extends Entity {
  /**
   * Title of the project
   */
  public title: string;

  /**
   * Due date for the project
   */
  public duedate: Date | null;

  /**
   * Tags associated with the project (copied to tasks created via this project)
   */
  public tags: string[];

  /**
   * Available statuses for tasks in this project
   */
  public statuses: string[];

  /**
   * Detailed description in markdown format
   */
  public description: string;

  constructor(
    title: string,
    duedate: Date | null = null,
    tags: string[] = [],
    statuses: string[] = ['pending', 'in_progress', 'completed'],
    description: string = '',
    id?: string
  ) {
    super(id);
    this.title = title;
    this.duedate = duedate;
    this.tags = tags;
    this.statuses = statuses;
    this.description = description;
  }
}
