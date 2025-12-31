/**
 * Represents a counter with items in different states
 */
export class Counter {
  /**
   * The states and their counts (e.g., { pending: 2, progress: 1, done: 3 })
   */
  public states: Record<string, number>;

  /**
   * The maximum total number of items in the counter
   */
  public total: number;

  constructor(states: Record<string, number> = {}, total: number = 0) {
    this.states = states;
    this.total = total;
  }
}
