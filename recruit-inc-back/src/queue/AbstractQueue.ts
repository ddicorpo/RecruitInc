export class AbstractQueue {
  next: AbstractQueue[];
  previous: AbstractQueue[];
  //TODO bring real queue data structure
  queue: string[];
  //gihubClient: GithubClient;

  enqueue(query: string) {}

  processNextQuery(): any {}

  saveToDatabase() {}
}
