import { IGithubClient } from './IGithubClient';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { GithubRepoStructure } from '../../data-extraction/github/githubRepoStructure';
import { techSourceFiles } from '../../matching-algo/data-model/input-model/TechSourceFiles';
import { IntersectionArrayString } from '../../util/IntersectionArrayString';
import { DownloadQueue } from "../queues/DownloadQueue";
import { IProjectStructure } from "../../matching-algo/data-model/input-model/IProjectStructure";
import { GithubUsersTDG } from '../../data-source/table-data-gateway/githubUsersTDG';

export class TreeClient implements IGithubClient {
  public _owner: string;
  public _repository: string;
  public _projectUrl: string;
  public _prospect: RequiredClientInformation;

  public constructor(prospect: RequiredClientInformation) {
    this._owner = prospect.repoOwner;
    this._repository = prospect.repoName;
    this._projectUrl = prospect.projectUrl;
    this._prospect = prospect;
  }

  private setSourceFilesArray(): string[] {
    const sourcefilesArr: string[] = [];
    for (const tech of techSourceFiles) {
      sourcefilesArr.push(tech.sourceFileName);
    }
    return sourcefilesArr;
  }

  //Should be for a single repo
  async executeQuery() {
    let repoStructure: GithubRepoStructure = new GithubRepoStructure();
    let struct : IProjectStructure[] = [];

    //Query to retrieve structure of current repo
    //Project structure for a single project at a time or for all projects? cuz that's what this next method does
     try{
     struct = await repoStructure.getRepoStructure(
      this._owner,
      this._repository
    );
     }catch(error){
         throw error;
     }

    //let projectInputs = struct.dataEntry.projectInputs;

    //Why are you doing it for a single project?
    let index: number = 0;
    //List of all filenames that should be downloaded
    const allSourcefileName = this.setSourceFilesArray();

    //pull instance of downloadQueue so taht we can populate it later on
    let downloadQueue = DownloadQueue.get_instance();

    //Loop through project structure to find specific files that need to be downloaded
    while (index < struct.length) {
      const tmpfileNameArr: string[] = [
        struct[index].fileName
      ];

      //Finds a match for a specific downloaded file
      const isSourceFile: boolean =
        IntersectionArrayString.intersection(allSourcefileName, tmpfileNameArr)
          .length > 0;

      //If file exists, update RequiredClientInformation object with file path and pass to downloads queue
      if (isSourceFile) {
        this._prospect.filePath =
          struct[index].filePath;
        // pass the updated requiredInfo package to the download queue
        downloadQueue.enqueue(this._prospect);
      }
      index++;
    }

    //Save STRUCT TO DB HERE
    //Save userinfo in the database
    await this.updateUser(this.prospect.user.login, struct, this._projectUrl);
  }


  public async updateUser(login: string, struct: IProjectStructure[], projectUrl: string ){
      let githubUsersTDG: GithubUsersTDG = new GithubUsersTDG();
      let criteria: any = { "githubUser.login": login} 
      let update: any = {
          $set: {"githubUser.dataEntry.projectInputs.$[pi].projectStructure": struct }
      }

      let options = {
          arrayFilters: [{"pi.url": projectUrl}]
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

  get prospect(): RequiredClientInformation {
    return this._prospect;
  }

  set prospect(value: RequiredClientInformation) {
    this._prospect = value;
  }
}
