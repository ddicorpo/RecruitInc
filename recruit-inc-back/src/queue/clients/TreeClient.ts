import { IGithubClient } from './IGithubClient';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { GithubRepoStructure } from '../../data-extraction/github/githubRepoStructure';
import { techSourceFiles } from '../../matching-algo/data-model/input-model/TechSourceFiles';
import { IntersectionArrayString } from '../../util/IntersectionArrayString';

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

    let struct = await repoStructure.getRepoStructureFromUser(
      this.prospect.user
    );
    let projectInputs = struct.dataEntry.projectInputs;

    let index: number = 0;
    const allSourcefileName = this.setSourceFilesArray();

    while (index < projectInputs[0].projectStructure.length) {
      const tmpfileNameArr: string[] = [
        projectInputs[0].projectStructure[index].fileName,
      ];

      const isSourceFile: boolean =
        IntersectionArrayString.intersection(allSourcefileName, tmpfileNameArr)
          .length > 0;

      if (isSourceFile) {
        this.prospect.filePath =
          projectInputs[0].projectStructure[index].filePath;
        //TODO: Populate the downloads queue
      }
    }

    //TODO: Save to database
  }
}
