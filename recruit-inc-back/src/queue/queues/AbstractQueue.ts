import { IGithubClient } from '../clients/IGithubClient';
import { IGithubUser } from '../../data-extraction/github/api-entities/IGithubUser';
import { GithubUserRepos } from '../../data-extraction/github/githubUserRepos';
import { RequiredClientInformation } from '../RequiredClientInformation';

export class AbstractQueue {
  //not needed if we go with a singleton pattern for each queue
  /*  private static next: AbstractQueue;
  private static previous: AbstractQueue;*/
  //TODO bring real queue data structure
  private static queue: IGithubClient[];
  //private static gihubClient: IGithubClient;
  //private static username: string;
  //private static token: string;
  //private static githubUser: IGithubUser;

  public enqueue(user: RequiredClientInformation) {}
  public dequeue() {}
  public isEmpty() {}
  public size() {}
  public processNextQuery(string): any {}
  public saveToDatabase() {}
  public loadFromDatabase() {}
}
