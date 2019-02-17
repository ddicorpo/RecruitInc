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

  constructor(prospect: RequiredClientInformation) {
    this.owner = prospect.repoOwner;
    this.repository = prospect.repoName;
    this.commitId = prospect.commitId;
    this.login = prospect.user.login;
  }

  async executeQuery() {
    let affected: GithubUserCommits = new GithubUserCommits();
    let allAffectedFiles: ISingleFileCommit[] = [];

    try{
    allAffectedFiles = await affected.getFilesAffectedByCommit(
      this.owner,
      this.repository,
      this.commitId
      //'absolutetrash'
    );
    } catch(error){
        throw error;
    }


    //TODO: Save to database
    await this.updateUser(this.login, this.repository, allAffectedFiles, this.commitId);
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

}
