import { Entity } from './Entity';

/**
 * Represents a milestone with dependencies on other milestones
 */
export class Milestone extends Entity {
  /**
   * Title of the milestone
   */
  public title: string;

  /**
   * Tags associated with the milestone
   */
  public tags: string[] = [];

  /**
   * Start date for the milestone (can be null)
   */
  public startdate: Date | null;

  /**
   * Due date for the milestone (can be null)
   */
  public duedate: Date | null;

  /**
   * Array of milestone IDs that are required before this milestone can start
   */
  public requirements: string[];

  constructor(
    title: string,
    startdate: Date | null = null,
    duedate: Date | null = null,
    requirements: string[] = [],
    id?: string
  ) {
    super(id);
    this.title = title;
    this.startdate = startdate;
    this.duedate = duedate;
    this.requirements = requirements;
  }
}
