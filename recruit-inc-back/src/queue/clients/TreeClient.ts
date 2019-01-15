import { IGithubClient } from './IGithubClient';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { GithubRepoStructure } from '../../data-extraction/github/githubRepoStructure';
import { techSourceFiles } from '../../matching-algo/data-model/input-model/TechSourceFiles';
import { IntersectionArrayString } from '../../util/IntersectionArrayString';
import { DownloadQueue } from "../queues/DownloadQueue";

export class TreeClient implements IGithubClient {
  private owner: string;
  private repository: string;
  private prospect: RequiredClientInformation;

  public constructor(prospect: RequiredClientInformation) {
    this.owner = prospect.repoOwner;
    this.repository = prospect.repoName;
    this.prospect = prospect;
  }

  private setSourceFilesArray(): string[] {
    const sourcefilesArr: string[] = [];
    for (const tech of techSourceFiles) {
      sourcefilesArr.push(tech.sourceFileName);
    }
    return sourcefilesArr;
  }

  async executeQuery() {
    let repoStructure: GithubRepoStructure = new GithubRepoStructure();

    //Query to retrieve structure of current repo
    let struct = await repoStructure.getRepoStructureFromUser(
      this.prospect.user
    );

    let projectInputs = struct.dataEntry.projectInputs;

    let index: number = 0;
    //List of all filenames that should be downloaded
    const allSourcefileName = this.setSourceFilesArray();

    //pull instance of downloadQueue so taht we can populate it later on
    let downloadQueue = DownloadQueue.get_instance();

    //Loop through project structure to find specific files that need to be downloaded
    while (index < projectInputs[0].projectStructure.length) {
      const tmpfileNameArr: string[] = [
        projectInputs[0].projectStructure[index].fileName,
      ];

      //Finds a match for a specific downloaded file
      const isSourceFile: boolean =
        IntersectionArrayString.intersection(allSourcefileName, tmpfileNameArr)
          .length > 0;

      //If file exists, update RequiredClientInformation object with file path and pass to downloads queue
      if (isSourceFile) {
        this.prospect.filePath =
          projectInputs[0].projectStructure[index].filePath;
        // pass the updated requiredInfo package to the download queue
        downloadQueue.enqueue(this.prospect);
      }
    }

    //TODO: Save to database
  }
}
