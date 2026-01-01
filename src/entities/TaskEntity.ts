import { Counter } from '../base/Counter';
import { Entity } from './Entity';
import { TagsList } from '../parts/TagsList';
import { Emitter, EventHandler, EventHandlerUninstaller } from '@pawel-kuznik/iventy';
import { Content } from '../parts/Content';
import { StatusManager } from '../parts/StatusManager';
import { Task } from '../interfaces/Task';

/**
 * Represents a task in the system. A task generally is a title and state.
 * Each state will have a slightly different meaning for the user and these
 * can be configured on a system, project, or task level.
 */
export class TaskEntity extends Entity implements Task {

  /**
   * The content of the task.
   */
  private _content: Content = new Content();

  /**
   * The status manager instance.
   */
  private _statusManager: StatusManager = new StatusManager();

  /**
   * Counter tracking items in different states
   * @todo make it private
   */
  public counter: Counter | null = null;

  /**
   * Array of project IDs that this task is attached to
   * @todo make it private
   */
  public projects: string[] = [];

  /**
   * Array of milestone IDs that this task is attached to
   * @todo make it private
   */
  public milestones: string[] = [];

  /**
   * The creation date of the task.
   */
  private _creationDate: Date = new Date();

  /**
   * The due date of the task.
   */
  private _dueDate: Date | null = null;

  /**
   *  Get the creation date of the task.
   */
  get creationDate(): Date {
    return this._creationDate;
  }

  /**
   *  Get the due date of the task.
   */
  get dueDate(): Date | null {
    return this._dueDate;
  }

  /**
   *  Get the title of the task.
   */
  get title(): string {
    return this._content.title;
  }

  /**
   *  Get the contents of the task.
   */
  get contents(): string {
    return this._content.contents;
  }
  
  /**
   * Get the current status of the task.
   */
  get status(): string {
    return this._statusManager.status;
  }

  /**
   * Get the available statuses for the task.
   */
  get availableStatuses(): string[] {
    return this._statusManager.availableStatuses;
  }

  /**
   * The event emitter instance.
   */
  private _emitter: Emitter = new Emitter();

  /**
   * The tags list instance.
   */
  private _tags: TagsList = new TagsList();

  constructor(id?: string) {
    super(id);

    // make sure all the changes from the tags and status manager can bubble to the task event emitter
    this._tags.bubbleTo(this._emitter);
    this._statusManager.bubbleTo(this._emitter);
    this._content.bubbleTo(this._emitter);
  }
  
  /**
   *  Set the contents of the task.
   */
  setContents(contents: string) : this {
    this._content.setContents(contents);
    return this;
  }

  /**
   *  Set the title of the task.
   */
  setTitle(title: string) : this {
    this._content.setTitle(title);
    return this;
  }

  /**
   *  Handle an event.
   */
  handle(event: string, callback: EventHandler) : EventHandlerUninstaller {
    return this._content.handle(event, callback);
  }

  /**
   *  Handle an event.
   */
  on(event: string, callback: EventHandler) : this {
    this._content.on(event, callback);
    return this;
  }

  /**
   * Stop listening to an event.
   */
  off(event: string, callback: EventHandler) : this {
    this._content.off(event, callback);
    return this;
  }

  /**
   * Set the creation date of the task.
   */
  setCreationDate(creationDate: Date) : this {
    this._creationDate = creationDate;
    this._emitter.trigger('changed.timeline', { creationDate });
    return this;
  }

  /**
   * Set the due date of the task.
   */
  setDueDate(dueDate: Date | null) : this {
    this._dueDate = dueDate;
    this._emitter.trigger('changed.timeline', { dueDate });
    return this;
  }

  /**
   * Set the current status of the task.
   * @throws InvalidInputError if the status is not one of the available statuses.
   */
  setStatus(status: string) : this {
    this._statusManager.setStatus(status);
    return this;
  }

  /**
   * Set the available statuses for the task.
   * @throws InvalidInputError if the available statuses is not an array of strings.
   */
  setAvailableStatuses(availableStatuses: string[]) : this {
    this._statusManager.setAvailableStatuses(availableStatuses);
    return this;
  }

  /**
   * Get the tags list.
   */
  getTags(): TagsList {
    return this._tags;
  }

  /**
   * Increase the current status of the task.
   * @throws InvalidInputError if the current status is not one of the available statuses.
   */
  increaseStatus() : this {
    this._statusManager.increaseStatus();
    return this;
  }

  /**
   * Decrease the current status of the task.
   * @throws InvalidInputError if the current status is not one of the available statuses.
   */
  decreaseStatus() : this {
    this._statusManager.decreaseStatus();
    return this;
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
