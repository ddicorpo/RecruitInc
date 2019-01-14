import { IGithubClient } from './IGithubClient';
import { IGithubUser } from '../../data-extraction/github/api-entities/IGithubUser';
import { GithubUserRepos } from '../../data-extraction/github/githubUserRepos';
import { RequiredClientInformation } from '../RequiredClientInformation';

export class RepositoryClient implements IGithubClient {
  private readonly accessToken: string;
  private username: string;

  public constructor(prospect: RequiredClientInformation) {
    this.accessToken = prospect.repoToken;
    this.username = prospect.user.login;
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

    //TODO: Store this information in db,
    //TODO: Populate Tree queue and Commit queue
  }
}
