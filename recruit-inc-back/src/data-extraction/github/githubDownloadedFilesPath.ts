import { GithubApiV3 } from './githubApiV3';
import { IGithubUser } from './api-entities/IGithubUser';
import { techSourceFiles } from '../../matching-algo/data-model/input-model/TechSourceFiles';
import { excludedFolders } from '../../matching-algo/data-model/input-model/ExcludedFolders';
import { IntersectionArrayString } from '../../util/IntersectionArrayString';
import { ISourceFiles } from '../../matching-algo/data-model/input-model/ISourceFiles';
import { Logger } from '../../Logger';

const fs = require('fs');
const logger = new Logger();

export class GithubDownloadedFilesPath {
  private readonly accessToken: string;
  private allSourcefileName: string[];
  public constructor(
    accessToken: string = process.env.GITHUB_DEFAULT_AUTH_TOKEN
  ) {
    this.accessToken = accessToken;
    this.allSourcefileName = this.setSourceFilesArray();
  }

  private setSourceFilesArray(): string[] {
    const sourcefilesArr: string[] = [];
    for (const tech of techSourceFiles) {
      sourcefilesArr.push(tech.sourceFileName);
    }
    return sourcefilesArr;
  }

  async downloadFile(
    owner: string,
    repoName: string,
    path: string
  ): Promise<ISourceFiles> {
    for (let excludedFolder of excludedFolders) {
      if (path.includes(excludedFolder)) return; //Don't download package.json within node_modules
    }
    let data;
    let jsonData;
    try {
      data = await new GithubApiV3().downloadFile(
        this.accessToken,
        owner,
        repoName,
        path
      );
      jsonData = JSON.parse(data);
      if (jsonData.content == null)
        throw new TypeError(
          'The file you are trying to download does not exist.'
        );
    } catch (error) {
      logger.error({
        class: 'GithubDownloadedFilesPath',
        method: 'downloadFile',
        action: 'Error while trying to obtain the contents of a file.',
        params: {},
        value: error.toString(),
      });
      if (
        error
          .toString()
          .includes('https://developer.github.com/v3/#rate-limiting') &&
        !error.toString().includes('sha')
      ) {
        throw error;
      }
      return data;
    }
    let content = Buffer.from(jsonData.content, 'base64').toString();

    return {
      filename: jsonData.name,
      repoFilePath: jsonData.path,
      fileContents: content,
    };
  }

  generatePath(username: string, repoName: string, filePath: string): string {
    return `downloaded/${username}/github/${repoName}/${filePath}`;
  }

  async downloadFileForUser(user: IGithubUser): Promise<IGithubUser> {
    if (
      user.dataEntry.projectInputs == null ||
      user.dataEntry.projectInputs.length == 0
    ) {
      return user;
    }
    for (let repository of user.dataEntry.projectInputs) {
      if (!repository.downloadedSourceFile) {
        repository.downloadedSourceFile = [];
      }
      if (
        repository.projectStructure == null ||
        repository.projectStructure.length == 0
      ) {
        continue;
      }

      for (let file of repository.projectStructure) {
        const tmpfileNameArr: string[] = [file.fileName];
        const isSourceFile: boolean =
          IntersectionArrayString.intersection(
            this.allSourcefileName,
            tmpfileNameArr
          ).length > 0;
        if (isSourceFile) {
          let sourceFile: {
            filename: string;
            repoFilePath: string;
            fileContents: string;
          } = await this.downloadFile(
            repository.owner,
            repository.projectName,
            file.filePath
          );
          if (!sourceFile) continue;
          repository.downloadedSourceFile.push(sourceFile);
        }
      }
    }
    return user;
  }
  async downloadSingleFile(
    owner: string,
    repoName: string,
    path: string,
    login: string
  ): Promise<ISourceFiles> {
    let sourceFile: {
      filename: string;
      repoFilePath: string;
      fileContents: string;
    };
    try {
      sourceFile = await this.downloadFile(owner, repoName, path);
    } catch (error) {
      throw error;
    }
    return sourceFile;
  }
}
