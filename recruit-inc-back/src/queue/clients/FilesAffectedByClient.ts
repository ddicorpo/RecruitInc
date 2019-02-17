import { IGithubClient } from './IGithubClient';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { GithubUserCommits } from '../../data-extraction/github/githubUserCommits';
import { GithubUsersTDG } from '../../data-source/table-data-gateway/githubUsersTDG';
import { ISourceFiles } from '../../matching-algo/data-model/input-model/ISourceFiles';
import { ISingleFileCommit } from '../../matching-algo/data-model/input-model/ISingleFileCommit';

export class FilesAffectedByClient implements IGithubClient {
  public _owner: string;
  public _repository: string;
  public _commitId: string;
  public _login: string;

  constructor(prospect: RequiredClientInformation) {
    this._owner = prospect.repoOwner;
    this._repository = prospect.repoName;
    this._commitId = prospect.commitId;
    this._login = prospect.user.login;
  }

  async executeQuery() {
    let affected: GithubUserCommits = new GithubUserCommits();
    let allAffectedFiles: ISingleFileCommit[] = [];

    try{
    allAffectedFiles = await affected.getFilesAffectedByCommit(
      this._owner,
      this._repository,
      this._commitId
      //'absolutetrash'
    );
    } catch(error){
        throw error;
    }


    //TODO: Save to database
    await this.updateUser(this._login, this._repository, allAffectedFiles, this._commitId);
  }

  public async updateUser(login: string, projectName: string, allAffectedFiles: ISingleFileCommit[], commitId: string){
      let githubUsersTDG: GithubUsersTDG = new GithubUsersTDG();
      let criteria: any = { "githubUser.login": login }

      let update: any = {
          $set: {"githubUser.dataEntry.projectInputs.$[pI].applicantCommits.$[aC].files": allAffectedFiles }
      }

      let options = {  
          arrayFilters: [{"pI.projectName": projectName}, {"aC.id": commitId}]
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

  get commitId(): string {
    return this._commitId;
  }

  set commitId(value: string) {
    this._commitId = value;
  }

  public get login(): string {
    return this._login;
  }

  public set login(value: string) {
    this._login = value;
  }
}
