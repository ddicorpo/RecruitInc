import { IGithubClient } from './IGithubClient';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { GithubUserCommits } from '../../data-extraction/github/githubUserCommits';
import { FilesAffectedByQueue } from "../queues/FilesAffectedByQueue";
import { GithubUsersTDG } from '../../data-source/table-data-gateway/githubUsersTDG';
import { ICommit } from '../../matching-algo/data-model/input-model/ICommit';

export class CommitClient implements IGithubClient {
  private _owner: string;
  private _repository: string;
  private _userId: string;
  private _prospect: RequiredClientInformation;

  public constructor(prospect: RequiredClientInformation) {
    this._owner = prospect.repoOwner;
    this._repository = prospect.repoName;
    this._userId = prospect.user.id;
    this._prospect = prospect;
  }

  async executeQuery() {
    let commits: GithubUserCommits = new GithubUserCommits();

    let allCommits: ICommit[] = await commits.getCommits(
      this._repository,
      this._owner,
      this._userId
    );
    //pull the filesAffectedByQueue instance, so that we can populate its queue in this method
    let filesAffected = FilesAffectedByQueue.get_instance();

    //Loop through all commits to update RequiredClientInformation and pass to files affected queue
    for (let singleCommit of allCommits) {
      this._prospect.commitId = singleCommit.id;
      //pass the updated requiredInfo package to the filesAffectedQueue
      filesAffected.enqueue(this._prospect);
    }

    //TODO: Save to database
    await this.updateUser(this.prospect.user.login, this._repository, allCommits);
  }

  public async updateUser(login: string, projectName: string, allCommits: ICommit[] ){
      let githubUsersTDG: GithubUsersTDG = new GithubUsersTDG();
      let criteria: any = {
          "githubUsers.login": login,
          githubUsers: {
              $elemMatch: {
                  login: login
              }
          }
      }
      let update: any = {
          $set: {"githubUsers.$[gU].dataEntry.projectInputs.$[pI].applicantCommits": allCommits }
      }
      let options = {                         //Might cause issues if user contributes to several project with same name
          arrayFilters: [{"gU.login": login}, {"pI.projectName": projectName}]
      }

      await githubUsersTDG.generalUpdate(criteria, update, options);
  
  }

  get owner(): string {
    return this._owner;
  }

  set owner(value: string) {
    this._owner = value;
  }

  get repository(): string {
    return this._repository;
  }

  set repository(value: string) {
    this._repository = value;
  }

  get userId(): string {
    return this._userId;
  }

  set userId(value: string) {
    this._userId = value;
  }

  get prospect(): RequiredClientInformation {
    return this._prospect;
  }

  set prospect(value: RequiredClientInformation) {
    this._prospect = value;
  }
}
