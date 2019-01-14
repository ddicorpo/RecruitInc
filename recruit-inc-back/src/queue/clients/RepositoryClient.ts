import { IGithubClient } from './IGithubClient';
import { IGithubUser } from '../../data-extraction/github/api-entities/IGithubUser';
import { GithubUserRepos } from '../../data-extraction/github/githubUserRepos';

export class RepositoryClient implements IGithubClient {
  private readonly accessToken: string;
  private username: string;

  public constructor(login: string, accesstoken: string) {
    this.accessToken = accesstoken;
    this.username = login;
  }

  //executeQuery(username: string, githubUser: IGithubUser, token?: string) {}
  async executeQuery() {
    let user: IGithubUser = {
      login: this.username,
      createdAt: '',
      url: '',
      email: '',
    };

    let githubUserRepos: GithubUserRepos = new GithubUserRepos(
      this.accessToken
    );

    let allRepos = await githubUserRepos.getUserRepos(user);
    //TODO:Store this information in db, and use it to create a Tree client and Commit client and pass them to respective queue
  }
}
