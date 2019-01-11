import { IGithubClient } from './IGithubClient';
import { IGithubUser } from '../../data-extraction/github/api-entities/IGithubUser';

export class TreeClient implements IGithubClient {
  private owner: string;
  private repository: string;
  private treeSha: string;

  executeQuery(username: string, githubUser: IGithubUser, token?: string) {}
}
