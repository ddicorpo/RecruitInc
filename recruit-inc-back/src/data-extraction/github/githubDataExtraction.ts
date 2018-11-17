import { IGithubUser } from './api-entities/IGithubUser';
import { GithubUserRepos } from './githubUserRepos';
import { GithubRepoStructure } from './githubRepoStructure';
import { GithubDownloadedFilesPath } from './githubDownloadedFilesPath';
import { GithubUserCommits } from './githubUserCommits';
import { MatcherClient } from '../../matching-algo/matcher-client/MatcherClient';
import { IGitProjectSummary } from '../../matching-algo/data-model/output-model/IGitProjectSummary';
import { techSourceFiles } from '../../matching-algo/data-model/input-model/TechSourceFiles';

export class GithubDataExtraction {
  private readonly accessToken: string;

  public constructor(
    accessToken: string = process.env.GITHUB_DEFAULT_AUTH_TOKEN
  ) {
    this.accessToken = accessToken;
  }

  async extractData(login: string, email: string = ''): Promise<IGithubUser> {
    let user: IGithubUser = {
      login: login,
      createdAt: '',
      url: '',
      email: email,
    };

    //Get all of the user's repos
    let githubUserRepos: GithubUserRepos = new GithubUserRepos(
      this.accessToken
    );
    user = await githubUserRepos.getUserRepos(user);

    //Get the repositories' structure
    let githubRepoStructure: GithubRepoStructure = new GithubRepoStructure(
      this.accessToken
    );
    user = await githubRepoStructure.getRepoStructureFromUser(user);

    //Get commits and their details
    let githubUserCommits: GithubUserCommits = new GithubUserCommits(
      this.accessToken
    );
    user = await githubUserCommits.getCommitsFromUser(user);
    user = await githubUserCommits.getFilesAffectedByCommitFromUser(user);
    //Search for SourceFile and download it if found
    let githubDownloadedFilesPath: GithubDownloadedFilesPath = new GithubDownloadedFilesPath(
      this.accessToken
    );
    user = await githubDownloadedFilesPath.downloadFileForUser(user);
    let client: MatcherClient = new MatcherClient(user.dataEntry);
    return user;
  }

  async matchGithubUser(
    login: string,
    email: string = ''
  ): Promise<IGitProjectSummary> {
    let user: IGithubUser = await this.extractData(login, email);

    let client: MatcherClient = new MatcherClient(user.dataEntry);

    let output: IGitProjectSummary = client.execute();
    return output;
  }
}
