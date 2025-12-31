import { Task } from './types/Task';
import { Project } from './types/Project';
import { Milestone } from './types/Milestone';
import { Counter } from './types/Counter';

/**
 * Serialized format for storing repository data
 */
export interface RepositoryData {
  tasks: Record<string, Task>;
  projects: Record<string, Project>;
  milestones: Record<string, Milestone>;
}

/**
 * Repository class for managing tasks, projects, and milestones
 */
export class Repository {
  private tasks: Map<string, Task> = new Map();
  private projects: Map<string, Project> = new Map();
  private milestones: Map<string, Milestone> = new Map();

  /**
   * Get a task by its ID
   */
  getTask(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  /**
   * Get all tasks
   */
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Get a project by its ID
   */
  getProject(id: string): Project | undefined {
    return this.projects.get(id);
  }

  /**
   * Get all projects
   */
  getAllProjects(): Project[] {
    return Array.from(this.projects.values());
  }

  /**
   * Get a milestone by its ID
   */
  getMilestone(id: string): Milestone | undefined {
    return this.milestones.get(id);
  }

  /**
   * Get all milestones
   */
  getAllMilestones(): Milestone[] {
    return Array.from(this.milestones.values());
  }

  /**
   * Create a new task and add it to the repository
   */
  createTask(
    title: string,
    description?: string,
    date?: Date,
    duedate?: Date | null,
    tags?: string[],
    status?: string,
    counter?: Counter | null,
    projects?: string[],
    milestones?: string[]
  ): Task {
    const task = new Task(
      title,
      description,
      date,
      duedate,
      tags,
      status,
      counter,
      projects,
      milestones
    );
    this.tasks.set(task.id, task);
    return task;
  }

  /**
   * Create a new project and add it to the repository
   */
  createProject(
    title: string,
    duedate?: Date | null,
    tags?: string[],
    statuses?: string[],
    description?: string
  ): Project {
    const project = new Project(title, duedate, tags, statuses, description);
    this.projects.set(project.id, project);
    return project;
  }

  /**
   * Create a new milestone and add it to the repository
   */
  createMilestone(
    title: string,
    tags?: string[],
    startdate?: Date | null,
    duedate?: Date | null,
    requirements?: string[]
  ): Milestone {
    const milestone = new Milestone(title, tags, startdate, duedate, requirements);
    this.milestones.set(milestone.id, milestone);
    return milestone;
  }

  /**
   * Insert or update a task (emplace)
   */
  emplaceTask(task: Task): void {
    this.tasks.set(task.id, task);
  }

  /**
   * Insert or update a project (emplace)
   */
  emplaceProject(project: Project): void {
    this.projects.set(project.id, project);
  }

  /**
   * Insert or update a milestone (emplace)
   */
  emplaceMilestone(milestone: Milestone): void {
    this.milestones.set(milestone.id, milestone);
  }

  /**
   * Delete a task by ID
   */
  deleteTask(id: string): boolean {
    return this.tasks.delete(id);
  }

  /**
   * Delete a project by ID
   */
  deleteProject(id: string): boolean {
    return this.projects.delete(id);
  }

  /**
   * Delete a milestone by ID
   */
  deleteMilestone(id: string): boolean {
    return this.milestones.delete(id);
  }

  /**
   * Export all data as a JSON object
   */
  toJSON(): RepositoryData {
    return {
      tasks: Object.fromEntries(this.tasks),
      projects: Object.fromEntries(this.projects),
      milestones: Object.fromEntries(this.milestones),
    };
  }

  /**
   * Import data from a JSON object
   */
  fromJSON(data: RepositoryData): void {
    this.tasks.clear();
    this.projects.clear();
    this.milestones.clear();

    // Reconstruct Task instances
    for (const [id, taskData] of Object.entries(data.tasks)) {
      const counter = taskData.counter
        ? new Counter(taskData.counter.states, taskData.counter.total)
        : null;

      const task = new Task(
        taskData.title,
        taskData.description,
        new Date(taskData.date),
        taskData.duedate ? new Date(taskData.duedate) : null,
        taskData.tags,
        taskData.status,
        counter,
        taskData.projects,
        taskData.milestones,
        id
      );
      this.tasks.set(id, task);
    }

    // Reconstruct Project instances
    for (const [id, projectData] of Object.entries(data.projects)) {
      const project = new Project(
        projectData.title,
        projectData.duedate ? new Date(projectData.duedate) : null,
        projectData.tags,
        projectData.statuses,
        projectData.description,
        id
      );
      this.projects.set(id, project);
    }

    // Reconstruct Milestone instances
    for (const [id, milestoneData] of Object.entries(data.milestones)) {
      const milestone = new Milestone(
        milestoneData.title,
        milestoneData.tags,
        milestoneData.startdate ? new Date(milestoneData.startdate) : null,
        milestoneData.duedate ? new Date(milestoneData.duedate) : null,
        milestoneData.requirements,
        id
      );
      this.milestones.set(id, milestone);
    }
  }

  /**
   * Create a new Repository from JSON data
   */
  static fromJSON(data: RepositoryData): Repository {
    const repository = new Repository();
    repository.fromJSON(data);
    return repository;
  }

  /**
   * Clear all data from the repository
   */
  clear(): void {
    this.tasks.clear();
    this.projects.clear();
    this.milestones.clear();
  }
}
