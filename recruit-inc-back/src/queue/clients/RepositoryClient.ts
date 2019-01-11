import { IGithubClient } from './IGithubClient';
import { IGithubUser } from '../../data-extraction/github/api-entities/IGithubUser';

export class RepositoryClient implements IGithubClient {
  private cursor: string;

  executeQuery(username: string, githubUser: IGithubUser, token?: string) {}
}
