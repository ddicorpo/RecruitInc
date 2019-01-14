import { IGithubClient } from './IGithubClient';
import { IGithubUser } from '../../data-extraction/github/api-entities/IGithubUser';

export class DownloadClient implements IGithubClient {
  private owner: string;
  private repository: string;
  private path: string;

  //executeQuery(username: string, githubUser: IGithubUser, token?: string) {}
  executeQuery() {}
}
