import { GithubApiV4 } from './githubApiV4';
import { GithubApiV3 } from './githubApiV3';
import { IGithubUser } from './api-entities/IGithubUser';

const logger = require('../../logger.js');
const path = require('path');

export class GithubRepoStructure {
  private readonly accessToken: string;

  public constructor(
    accessToken: string = '37780cb5a0cd8bbedda4c9537ebf348a6e402baf'
  ) {
    this.accessToken = accessToken;
  }

  async getTreeSha(owner: string, repoName: string): Promise<string> {
    let query: string = `query {
  repository(owner: "${owner}", name: "${repoName}"){
    name
    object(expression: "master:"){ 
        ... on Tree{ 
          oid
        }
      }
    }
  }`;

    return await new GithubApiV4().queryData(this.accessToken, query);
  }

  async getRepoStructureFromUser(user: IGithubUser): Promise<IGithubUser> {
    for (let repository of user.dataEntry.projectInputs) {
      repository.projectStructure = await this.getRepoStructure(
        repository.owner,
        repository.projectName
      );
    }
    return user;
  }

  async getRepoStructure(
    owner: string,
    repoName: string
  ): Promise<{ fileId: string; fileName: string; filePath: string }[]> {
    let data: string = '';
    let treeSha: string = '';
    let projectStructure: {
      fileId: string;
      fileName: string;
      filePath: string;
    }[] = [];
    let jsonData;

    try {
      data = await this.getTreeSha(owner, repoName);
      jsonData = JSON.parse(data);
      if (jsonData.data == null || jsonData.data.repository == null)
        throw new TypeError(
          'Either you do not have access to the repository you are trying to query or it does not exist'
        );
      if (!jsonData.data.repository.object)
        throw new TypeError(
          `The Repository (${repoName}) you are trying to query is empty.`
        ); //Can't read oid of null error
    } catch (error) {
      logger.error(
        {
          class: 'GithubRepoStructure',
          method: 'getRepoStructure',
          action: "Error while trying to obtain the repo's root tree sha.",
          value: error.toString(),
        },
        { timestamp: new Date().toLocaleTimeString(), processID: process.pid }
      );
      return [];
    }

    treeSha = jsonData.data.repository.object.oid;
    try {
      data = await new GithubApiV3().getGitTree(
        this.accessToken,
        owner,
        repoName,
        treeSha
      );
      jsonData = JSON.parse(data);
      if (!jsonData.hasOwnProperty('tree'))
        throw new TypeError(
          'Either you do not have access to the repository you are trying to query or it does not exist'
        );
    } catch (error) {
      logger.error(
        {
          class: 'GithubRepoStructure',
          method: 'getRepoStructure',
          action: "Error while trying to obtain the repo's root tree sha.",
          value: error.toString(),
        },
        { timestamp: new Date().toLocaleTimeString(), processID: process.pid }
      );
      return [];
    }

    let tree = jsonData.tree;
    //only include blobs in project structure
    for (let file of tree) {
      if (file.type == 'blob')
        projectStructure.push({
          fileId: file.sha,
          fileName: path.basename(file.path),
          filePath: file.path,
        });
    }

    return projectStructure;
  }
}
