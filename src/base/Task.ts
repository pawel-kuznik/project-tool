import { Counter } from './Counter';
import { Entity } from './Entity';
import { TagsListHolder } from './TagsListHolder';
import { TagsList } from './TagsList';
import { TagsHolder } from './TagsHolder';

/**
 * Represents a task in the system. A task generally is a title and state.
 * Each state will have a slightly different meaning for the user and these
 * can be configured on a system, project, or task level.
 */
export class Task extends Entity implements TagsListHolder, TagsHolder {
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
   * Current status of the task (configurable at various levels)
   */
  public status: string;

  /**
   * Counter tracking items in different states
   */
  public counter: Counter | null = null;

  /**
   * Array of project IDs that this task is attached to
   */
  public projects: string[] = [];

  /**
   * Array of milestone IDs that this task is attached to
   */
  public milestones: string[] = [];

  private _tags: TagsList = new TagsList();

  constructor(
    title: string,
    description: string = '',
    date: Date = new Date(),
    duedate: Date | null = null,
    status: string = 'pending',
    id?: string
  ) {
    super(id);
    this.title = title;
    this.description = description;
    this.date = date;
    this.duedate = duedate;
    this.status = status;
  }

  /**
   * Set a given status of the task.
   */
  setStatus(status: string) : this {
    this.status = status;
    return this;
  }
  
  /**
   * Get the tags list.
   */
  getTags(): TagsList {
    return this._tags;
  }

  /* Methods from TagsHolder interface */

  /**
   * Get the tags.
   */
  get tags(): readonly string[] {
    return this._tags.tags;
  }

  /**
   * Contains a tag.
   */
  containsTag(tag: string): boolean;
  containsTag(tag: string[]): boolean;
  containsTag(tag: string | string[]): boolean {
    return Array.isArray(tag) ? this._tags.containsTag(tag) : this._tags.containsTag(tag);
  }

  /**
   * Add a tag.
   */
  addTag(tag: string): this;
  addTag(tag: string[]): this;
  addTag(tag: string | string[]): this {
    if (Array.isArray(tag)) {
      tag.forEach(t => this._tags.addTag(t));
    } else {
      this._tags.addTag(tag);
    }
    return this;
  }

  /**
   * Remove a tag.
   */
  removeTag(tag: string): this;
  removeTag(tag: string[]): this;
  removeTag(tag: string | string[]): this {
    if (Array.isArray(tag)) {
      tag.forEach(t => this._tags.removeTag(t));
    } else {
      this._tags.removeTag(tag);
    }
    return this;
  }
}
