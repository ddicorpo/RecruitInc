import { IGithubUser } from '../../data-extraction/github/api-entities/IGithubUser';

export interface IGithubClient {
  //executeQuery(username: string, githubUser: IGithubUser, token?: string);
  executeQuery(string);
}
