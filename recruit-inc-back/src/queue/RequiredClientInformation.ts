import { IGithubUser } from '../data-extraction/github/api-entities/IGithubUser';

export class RequiredClientInformation {
  //Everything public! Due to lack of testing the reload CommitQueue, RepositoryQueue and TreeQueue
  public user: IGithubUser;
  public repoName: string;
  public projectUrl: string;
  public repoOwner: string;
  public repoToken: string;
  public filePath: string;
  public commitId: string;
  public location: string;

  public constructor(
    user: IGithubUser,
    repoName: string,
    repoOwner: string,
    filePath: string,
    commitId: string,
    location: string,
    projectUrl: string
  ) {
    this.user = user;
    this.repoName = repoName;
    this.repoOwner = repoOwner;
    this.filePath = filePath;
    this.commitId = commitId;
    this.repoToken = process.env.GITHUB_DEFAULT_AUTH_TOKEN;
    this.location = location;
    this.projectUrl = projectUrl;
  }


}
