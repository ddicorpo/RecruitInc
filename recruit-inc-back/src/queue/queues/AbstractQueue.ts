import { IGithubClient } from '../clients/IGithubClient';
import { IGithubUser } from '../../data-extraction/github/api-entities/IGithubUser';

export class AbstractQueue {
  private next: AbstractQueue[];
  private previous: AbstractQueue[];
  //TODO bring real queue data structure
  private queue: string[];
  private gihubClient: IGithubClient;

  private username: string;
  private token: string;
  private githubUser: IGithubUser;

  public enqueue(user: IGithubUser, query: any) {}
  public processNextQuery(): any {}
  public saveToDatabase() {}
}
