import { IGithubClient } from './IGithubClient';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { GithubUserCommits } from '../../data-extraction/github/githubUserCommits';
import { GithubUsersTDG } from '../../data-source/table-data-gateway/githubUsersTDG';
import { ISourceFiles } from '../../matching-algo/data-model/input-model/ISourceFiles';
import { ISingleFileCommit } from '../../matching-algo/data-model/input-model/ISingleFileCommit';

export class FilesAffectedByClient implements IGithubClient {
  public owner: string;
  public repository: string;
  public commitId: string;
  public login: string;
  public email: string;

  constructor(prospect: RequiredClientInformation) {
    this.owner = prospect.repoOwner;
    this.repository = prospect.repoName;
    this.commitId = prospect.commitId;
    this.login = prospect.user.login;
    this.email = prospect.user.email;
  }

  async executeQuery(token: string) {
    let affected: GithubUserCommits = new GithubUserCommits(token);
    let allAffectedFiles: ISingleFileCommit[] = [];

    try {
      allAffectedFiles = await affected.getFilesAffectedByCommit(
        this.owner,
        this.repository,
        this.commitId
      );
    } catch (error) {
      throw error;
    }
    if (!this.email) {
      await this.setUserEmail(
        this.login,
        this.owner,
        this.repository,
        this.commitId,
        token
      );
    }

    //TODO: Save to database
    await this.updateUser(
      this.login,
      this.repository,
      allAffectedFiles,
      this.commitId
    );
  }

  public async setUserEmail(
    login: string,
    owner: string,
    repository: string,
    commitId: string,
    token: string
  ) {
    let githubUserCommits: GithubUserCommits = new GithubUserCommits(token);
    let githubUsersTDG: GithubUsersTDG = new GithubUsersTDG();
    let email: string = await githubUserCommits.getCommiterEmail(
      owner,
      repository,
      commitId
    );
    let criteria: any = { 'githubUser.login': login };
    let update: any = {
      $set: { 'githubUser.email': email },
    };

    await githubUsersTDG.generalUpdate(criteria, update);
  }
  public async updateUser(
    login: string,
    projectName: string,
    allAffectedFiles: ISingleFileCommit[],
    commitId: string
  ) {
    let githubUsersTDG: GithubUsersTDG = new GithubUsersTDG();
    let criteria: any = { 'githubUser.login': login };

    let update: any = {
      $set: {
        'githubUser.dataEntry.projectInputs.$[pI].applicantCommits.$[aC].files': allAffectedFiles,
      },
    };

    let options = {
      arrayFilters: [{ 'pI.projectName': projectName }, { 'aC.id': commitId }],
    };

    await githubUsersTDG.generalUpdate(criteria, update, options);
  }
}
