import { AbstractQueue } from './queues/AbstractQueue';
import { IGithubUser } from '../data-extraction/github/api-entities/IGithubUser';
import { GithubUserRepos } from '../data-extraction/github/githubUserRepos';
import { IGithubClient } from './clients/IGithubClient';

export class Controller {
  private queue: AbstractQueue;

  public execute(name?: string, token?: string) {
    //if username is defined
    if (name !== undefined) {
      //if token is also defined
      if (token !== undefined) {
      }

      let user: IGithubUser = { login: name, url: '', createdAt: '' };

      this.queue.enqueue(user);
    }
  }
}
