import { IGithubClient } from './IGithubClient';
import { IGithubUser } from '../../data-extraction/github/api-entities/IGithubUser';

export class TreeShaClient implements IGithubClient {
  private owner: string;
  private repository: string;

  executeQuery(username: string, githubUser: IGithubUser, token?: string) {}
}
