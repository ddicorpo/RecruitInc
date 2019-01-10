export class AbstractQueue {
  private next: AbstractQueue[];
  private previous: AbstractQueue[];
  //TODO bring real queue data structure
  private queue: string[];
  //private gihubClient: GithubClient;

  public enqueue(query: string) {}

  public processNextQuery(): any {}

  public saveToDatabase() {}
}
