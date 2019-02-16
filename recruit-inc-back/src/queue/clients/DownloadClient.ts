import { IGithubClient } from './IGithubClient';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { GithubDownloadedFilesPath } from '../../data-extraction/github/githubDownloadedFilesPath';
import { GithubUsersTDG } from '../../data-source/table-data-gateway/githubUsersTDG';
import { ICommit } from '../../matching-algo/data-model/input-model/ICommit';
import { ISourceFiles } from '../../matching-algo/data-model/input-model/ISourceFiles';

export class DownloadClient implements IGithubClient {
  private _owner: string;
  private _repository: string;
  private _path: string;
  private _login: string;
  

  public constructor(prospect: RequiredClientInformation) {
    this._owner = prospect.repoOwner;
    this._repository = prospect.repoName;
    this._path = prospect.filePath;
    this._login = prospect.user.login;
  }

  async executeQuery() {
    let downloads: GithubDownloadedFilesPath = new GithubDownloadedFilesPath();

    let downlaodedFile: ISourceFiles;

    try{
    downlaodedFile = await downloads.downloadSingleFile(
      this._owner,
      this._repository,
      this._path,
      this._login
    );
    } catch(error){
        throw error;
    }

    //TODO: Save to database
    await this.updateUser(this._login, this._repository, downlaodedFile)
  }

  
  public async updateUser(login: string, projectName: string, downlaodedFile: ISourceFiles){
      let githubUsersTDG: GithubUsersTDG = new GithubUsersTDG();
      let criteria: any = { "githubUser.login": login }
      let update: any = {
          $push: {"githubUser.dataEntry.projectInputs.$[pI].downloadedSourceFile": downlaodedFile }
      }
      let options = {                         //Might cause issues if user contributes to several project with same name
          arrayFilters: [{"pI.projectName": projectName}]
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

  get path(): string {
    return this._path;
  }

  set path(value: string) {
    this._path = value;
  }

    get login(): string {
        return this._login;
    }

    set login(value: string) {
        this._login = value;
    }
}
