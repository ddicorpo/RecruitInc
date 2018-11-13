import fetch from 'node-fetch';
import { IGitProjectInput } from '../../matching-algo/data-model/input-model/IGitProjectInput';
import { IProjectStructure } from '../../matching-algo/data-model/input-model/IProjectStructure';
import { ICommit } from '../../matching-algo/data-model/input-model/ICommit';
import { ISingleFileCommit } from '../../matching-algo/data-model/input-model/ISingleFileCommit';
import { ISourceFiles } from '../../matching-algo/data-model/input-model/ISourceFiles';
import { MatcherClient } from '../../matching-algo/matcher-client/MatcherClient';
import { IDataEntry } from '../../matching-algo/data-model/input-model/IDataEntry';
import { IGitProjectSummary } from '../../matching-algo/data-model/output-model/IGitProjectSummary';
import { IntersectionArrayString } from '../../util/IntersectionArrayString';
import { techSourceFiles } from '../../matching-algo/data-model/input-model/TechSourceFiles';
import { Logger } from '../../Logger';

const logger = new Logger();
const fs = require('fs');

export class BitbucketApi2 {
  private setSourceFilesArray(): string[] {
    const sourcefilesArr: string[] = [];
    for (const tech of techSourceFiles) {
      sourcefilesArr.push(tech.sourceFileName);
    }
    return sourcefilesArr;
  }

  //this is the initial entry point into the bitbucket api, once we have the users accesstoken and username, we find all user commits, get complete project structures and download key files for matching algo
  public async queryUserInfo(accessToken: string, user: string): Promise<any> {
    logger.info({
      class: 'bitbucketApi2',
      method: 'queryData',
      action: 'Querying User Info',
      params: { accessToken, user },
    });
    return fetch(`https://api.bitbucket.org/2.0/users/${user}/repositories`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => response.json())
      .then(async body => {
        logger.info({
          class: 'bitbucketApi2',
          method: 'queryData',
          action: "Result from bitbucket's api for repo slug",
          params: {},
          value: body,
        });

        let iterator: number = 0;

        let allGitProjectInput: Array<any> = new Array<any>();

        while (iterator < body.values.length) {
          let gitProjectInput: IGitProjectInput = new class
            implements IGitProjectInput {
            applicantCommits: ICommit[];
            downloadedSourceFile: ISourceFiles[] = [];
            projectName: string;
            projectStructure: IProjectStructure[];
          }();

          gitProjectInput.projectName = body.values[iterator].slug;
          gitProjectInput.applicantCommits = await this.queryCommitInfo(
            accessToken,
            user,
            body.values[iterator].slug
          );
          gitProjectInput.projectStructure = await this.queryProjectStructInfo(
            accessToken,
            user,
            body.values[iterator].slug
          );

          //once all files retrieved from given repo, we loop through its structure to find specific files that are needed for the matching algo
          for (let i = 0; i < gitProjectInput.projectStructure.length; i++) {
            const tmpfileNameArr: string[] = [
              gitProjectInput.projectStructure[i].fileName,
            ];
            const isSourceFile: boolean =
              IntersectionArrayString.intersection(
                this.setSourceFilesArray(),
                tmpfileNameArr
              ).length > 0;
            if (isSourceFile) {
              let sourceFile: ISourceFiles = new class implements ISourceFiles {
                filename: string;
                localFilePath: string;
                repoFilePath: string;
              }();

              sourceFile.filename =
                gitProjectInput.projectStructure[i].fileName;
              sourceFile.repoFilePath =
                gitProjectInput.projectStructure[i].filePath;
              let generatedPath: string = this.generatePath(
                user,
                gitProjectInput.projectName,
                sourceFile.repoFilePath
              );
              sourceFile.localFilePath = generatedPath;
              gitProjectInput.downloadedSourceFile.push(sourceFile);
              await this.queryDownloadFiles(
                accessToken,
                user,
                body.values[iterator].slug,
                gitProjectInput.projectStructure[i].fileId,
                gitProjectInput.projectStructure[i].filePath,
                generatedPath
              );
            }
          }

          allGitProjectInput.push(gitProjectInput);

          iterator++;
        }

        //this packages our collected data and launches the matching algo
        let dataEntry: IDataEntry = new class implements IDataEntry {
          projectInputs: IGitProjectInput[];
        }();

        dataEntry.projectInputs = allGitProjectInput;
        let client: MatcherClient = new MatcherClient(dataEntry);
        let output: IGitProjectSummary = client.execute();

        logger.info({
          class: 'bitbucketApi2',
          method: 'Matching Algo Output',
          action: 'THIS IS THE MATCHING ALGO OUTPUT FOR BITBUCKET',
          params: {},
          value: output,
        });

        console.log(JSON.stringify(output));

        return output;
      })
      .catch(error => {
        logger.error({
          class: 'bitbucketApi2',
          method: 'queryData',
          action: "Error from bitbucket's api: QUERY USER INFO",
          params: {},
          value: error,
        });
        throw error;
      });
  }

  //query to retrieve all commits related to the user for a specified repo
  public async queryCommitInfo(
    accessToken: string,
    user: string,
    repoName: string
  ): Promise<any[]> {
    logger.info({
      class: 'bitbucketApi2',
      method: 'queryData ',
      action: 'Querying Commit Info',
      params: { accessToken, user: user },
    });

    return fetch(
      `https://api.bitbucket.org/2.0/repositories/${user}/${repoName}/commits`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then(response => response.json())
      .then(async body => {
        logger.info({
          class: 'bitbucketApi2',
          method: 'queryData',
          action: "Result from bitbucket's api",
          params: {},
          value: body,
        });

        let iterator = 0;
        let allCommits: Array<any> = new Array<any>();

        while (iterator < body.values.length) {
          //if a commit is attributed to a user that does not have a bitbucket account, it will return undefined, the if statement protects from that edge case
          if (body.values[iterator].author.user != undefined) {
            if (
              JSON.stringify(body.values[iterator].author.user.username).match(
                user
              )
            ) {
              let allSingleCommits: Array<any> = new Array<any>();
              allSingleCommits = await this.queryDiffStats(
                accessToken,
                user,
                repoName,
                body.values[iterator].hash
              );
              let commit: ICommit = new class implements ICommit {
                files: ISingleFileCommit[];
                id: string;
                numberOfFileAffected: number;
              }();
              commit.id = body.values[iterator].hash;
              commit.numberOfFileAffected = allSingleCommits.length;
              commit.files = allSingleCommits;

              allCommits.push(commit);
            }
          }
          iterator++;
        }
        return allCommits;
      })
      .catch(error => {
        logger.error({
          class: 'bitbucketApi2',
          method: 'queryData',
          action: "Error from bitbucket's api: COMMIT INFO",
          params: {},
          value: error,
        });
        throw error;
      });
  }

  //queries to get the diffstats of each single file commit attributed to the user for a given repo
  public async queryDiffStats(
    accessToken: string,
    user: string,
    repoName: string,
    hash: string
  ): Promise<any[]> {
    logger.info({
      class: 'bitbucketApi2',
      method: 'queryData ',
      action: "Querying bitbucket's api for diffstats",
      params: { accessToken, user: user },
    });

    return fetch(
      `https://api.bitbucket.org/2.0/repositories/${user}/${repoName}/diffstat/${hash}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then(response => response.json())
      .then(body => {
        logger.info({
          class: 'bitbucketApi2',
          method: 'queryData',
          action: "Result from bitbucket's api diffstats",
          params: {},
          value: body,
        });

        let singleCommitIndex: number = 0;
        let allSingleCommits: Array<any> = new Array<any>();

        while (singleCommitIndex < body.values.length) {
          let singleFileCommit: ISingleFileCommit = new class
            implements ISingleFileCommit {
            filePath: string;
            lineAdded: number;
            lineDeleted: number;
          }();
          singleFileCommit.lineAdded =
            body.values[singleCommitIndex].lines_added;
          singleFileCommit.lineDeleted =
            body.values[singleCommitIndex].lines_removed;

          //if a commit contains a file that has status removed, the new file path does not exist, therefore the old path needs to be accessed instead
          if (body.values[singleCommitIndex].new != undefined) {
            singleFileCommit.filePath = body.values[
              singleCommitIndex
            ].new.links.self.href.toString();
          } else {
            singleFileCommit.filePath = body.values[
              singleCommitIndex
            ].old.links.self.href.toString();
          }

          allSingleCommits.push(singleFileCommit);

          singleCommitIndex++;
        }

        return allSingleCommits;
      })
      .catch(error => {
        logger.error({
          class: 'bitbucketApi2',
          method: 'queryData',
          action:
            "Error from bitbucket's api: DIFF STATS: " +
            repoName +
            ' hash ' +
            hash +
            ' token ' +
            accessToken,
          params: {},
          value: error,
        });
        throw error;
      });
  }
  //querying to gather the project structure, this gets the initial layer of files, and calls the directory query to gather inner layers
  public async queryProjectStructInfo(
    accessToken: string,
    user: string,
    repoName: string
  ): Promise<any[]> {
    logger.info({
      class: 'bitbucketApi2',
      method: 'queryData',
      action: 'Querying Project Struct Info',
      params: { accessToken, user },
    });
    return fetch(
      `https://api.bitbucket.org/2.0/repositories/${user}/${repoName}/src`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then(response => response.json())
      .then(async body => {
        logger.info({
          class: 'bitbucketApi2',
          method: 'queryData',
          action: "Result from bitbucket's api for repo slug",
          params: {},
          value: body,
        });

        let fileIterator: number = 0;
        let innerIterator: number = 0;
        let allProjectStruct: Array<any> = new Array<any>();

        while (fileIterator < body.values.length) {
          //if its a directory launch a query to get the files within the directory, otherwise if its a commit file, clean the commit file data and store it
          if (body.values[fileIterator].type === 'commit_directory') {
            let tempProjectStructure: Array<any> = new Array<any>();
            tempProjectStructure = await this.queryDirectoryInfo(
              accessToken,
              user,
              repoName,
              body.values[0].commit.hash,
              body.values[fileIterator].path
            );

            while (innerIterator < tempProjectStructure.length) {
              allProjectStruct.push(tempProjectStructure[innerIterator]);
              innerIterator++;
            }
            innerIterator = 0;
            tempProjectStructure = [];
          } else if (body.values[fileIterator].type === 'commit_file') {
            let projStruct: IProjectStructure = new class
              implements IProjectStructure {
              fileId: string;
              fileName: string;
              filePath: string;
            }();

            projStruct.fileId = body.values[0].commit.hash;
            projStruct.filePath = body.values[fileIterator].path;
            //TODO: refactor the file name cleaner, also located in directory info query
            //needed to clean file name
            let tempPath = body.values[fileIterator].path;
            let split = tempPath.split('/');
            let slice = split.slice(split.length - 1);
            projStruct.fileName = slice;

            allProjectStruct.push(projStruct);
          } else {
            let emptyStruct: IProjectStructure = new class
              implements IProjectStructure {
              fileId: string;
              fileName: string;
              filePath: string;
            }();
            allProjectStruct.push(emptyStruct);
          }
          fileIterator++;
        }

        return allProjectStruct;
      })
      .catch(error => {
        logger.error({
          class: 'bitbucketApi2',
          method: 'queryData',
          action: "Error from bitbucket's api: PROJECT STRUCT INFO",
          params: {},
          value: error,
        });
        throw error;
      });
  }

  //recursive method that fetches the information from file directories and stores the files in the project structure
  public async queryDirectoryInfo(
    accessToken: string,
    user: string,
    repoName: string,
    hash: string,
    path: string
  ): Promise<any[]> {
    logger.info({
      class: 'bitbucketApi2',
      method: 'queryData',
      action: 'Querying Directory Info',
      params: { accessToken, user },
    });
    return fetch(
      `https://api.bitbucket.org/2.0/repositories/${user}/${repoName}/src/${hash}/${path}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then(response => response.json())
      .then(async body => {
        logger.info({
          class: 'bitbucketApi2',
          method: 'queryData',
          action: "Result from bitbucket's api for repo slug",
          params: {},
          value: body,
        });

        let fileIterator: number = 0;
        let innerIterator: number = 0;

        let allProjectStruct: Array<any> = new Array<any>();

        while (fileIterator < body.values.length) {
          //if its a directory recursively call the same method to get all inner files
          //else if its a commit file, clean the data and store it appropriately
          //base case, return empty object
          if (body.values[fileIterator].type === 'commit_directory') {
            let tempProjectStructure: Array<any> = new Array<any>();
            tempProjectStructure = await this.queryDirectoryInfo(
              accessToken,
              user,
              repoName,
              hash,
              body.values[fileIterator].path
            );

            while (innerIterator < tempProjectStructure.length) {
              allProjectStruct.push(tempProjectStructure[innerIterator]);
              innerIterator++;
            }
            innerIterator = 0;
            tempProjectStructure = [];
          } else if (body.values[fileIterator].type === 'commit_file') {
            let projStruct: IProjectStructure = new class
              implements IProjectStructure {
              fileId: string;
              fileName: string;
              filePath: string;
            }();
            projStruct.fileId = hash;
            projStruct.filePath = body.values[fileIterator].path;

            //cleans the file name to make it easier to handle
            let tempPath = body.values[fileIterator].path;
            let split = tempPath.split('/');
            let slice = split.slice(split.length - 1);
            projStruct.fileName = slice;

            allProjectStruct.push(projStruct);
          } else {
            let emptyStruct: IProjectStructure = new class
              implements IProjectStructure {
              fileId: string;
              fileName: string;
              filePath: string;
            }();
            allProjectStruct.push(emptyStruct);
          }
          fileIterator++;
        }

        return allProjectStruct;
      })
      .catch(error => {
        logger.error({
          class: 'bitbucketApi2',
          method: 'queryData',
          action: "Error from bitbucket's api: DIRECTORY INFO",
          params: {},
          value: error,
        });
        throw error;
      });
  }

  //fetches the specified file from a repo and downloads and stores the file locally
  public async queryDownloadFiles(
    accessToken: string,
    user: string,
    repoName: string,
    hash: string,
    fileName: string,
    generatedPath: string
  ): Promise<any> {
    logger.info({
      class: 'bitbucketApi2',
      method: 'queryData',
      action: "Querying bitbucket's api to download files",
      params: { accessToken, user },
    });
    return fetch(
      `https://api.bitbucket.org/2.0/repositories/${user}/${repoName}/src/${hash}/${fileName}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then(response => response.text())
      .then(body => {
        logger.info({
          class: 'bitbucketApi2',
          method: 'queryDownload',
          action: "Result from bitbucket's api for downloading files",
          params: {},
          value: body,
        });

        this.writeToFile(body, generatedPath);

        return body;
      })
      .catch(error => {
        logger.error({
          class: 'bitbucketApi2',
          method: 'queryDownload',
          action: "Error from bitbucket's api: DOWNLOAD FILE",
          params: {},
          value: error,
        });
        throw error;
      });
  }

  //This function creates directories as needed
  //So that when we try to write to a file with fs it does not throw an error
  writeToFile(content: string, path: string) {
    let notExist = path.split('/');
    let exists: string = '';
    for (let i = 0; i < notExist.length - 1; i++) {
      exists += `${notExist[i]}/`;
      if (fs.existsSync(exists)) continue;
      else fs.mkdirSync(exists);
    }

    fs.writeFile(path, content, err => {
      if (err) throw err;
    });
  }

  generatePath(username: string, repoName: string, filePath: string): string {
    return `downloaded/${username}/bitbucket/${repoName}/${filePath}`;
  }
}
