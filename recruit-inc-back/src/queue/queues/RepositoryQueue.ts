import { AbstractQueue } from './AbstractQueue';
import { RepositoryClient } from '../clients/RepositoryClient';
import { IGithubUser } from '../../data-extraction/github/api-entities/IGithubUser';
import { IGithubClient } from '../clients/IGithubClient';
import { RequiredClientInformation } from '../RequiredClientInformation';

export class RepositoryQueue extends AbstractQueue {
  private queue: RepositoryClient[];
  private static _instance: RepositoryQueue;

  private constructor() {
    super();
    this.queue = [];
  }

  public static get_instance() {
    return this._instance || (this._instance = new this());
  }

  public enqueue(prospect: RequiredClientInformation) {
    let repo: RepositoryClient = new RepositoryClient(
      prospect.user.login,
      prospect.repoToken
    );

    this.queue.push(repo);
  }

  public dequeue() {
    return this.queue.pop();
  }

  public isEmpty() {
    return this.queue == [];
  }

  public size() {
    return this.queue.length;
  }

  public processNextQuery(): any {
    this.dequeue().executeQuery();
  }

  //TODO: implement save to db feature
  public saveToDatabase() {}
}
