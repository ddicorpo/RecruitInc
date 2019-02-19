import { IGithubClient } from './IGithubClient';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { GithubDownloadedFilesPath } from '../../data-extraction/github/githubDownloadedFilesPath';
import { GithubUsersTDG } from '../../data-source/table-data-gateway/githubUsersTDG';
import { ICommit } from '../../matching-algo/data-model/input-model/ICommit';
import { ISourceFiles } from '../../matching-algo/data-model/input-model/ISourceFiles';

export class DownloadClient implements IGithubClient {
  public owner: string;
  public repository: string;
  public path: string;
  public login: string;
  

  public constructor(prospect: RequiredClientInformation) {
    this.owner = prospect.repoOwner;
    this.repository = prospect.repoName;
    this.path = prospect.filePath;
    this.login = prospect.user.login;
  }

  async executeQuery() {
    let downloads: GithubDownloadedFilesPath = new GithubDownloadedFilesPath();

    let downlaodedFile: ISourceFiles;

    try{
    downlaodedFile = await downloads.downloadSingleFile(
      this.owner,
      this.repository,
      this.path,
      this.login
    );
    } catch(error){
        throw error;
    }

    //TODO: Save to database
    await this.updateUser(this.login, this.repository, downlaodedFile)
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

}