import { GithubApiV4 } from './githubApiV4';
import { GithubApiV3 } from './githubApiV3';
import { IGithubUser } from './api-entities/IGithubUser';
import { IProjectStructure } from '../../matching-algo/data-model/input-model/IProjectStructure';
import { Logger } from '../../Logger';

const logger = new Logger();

const path = require('path');

export class GithubRepoStructure {
  private readonly accessToken: string;
  private throwError: boolean;

  public constructor(
    accessToken: string = process.env.GITHUB_DEFAULT_AUTH_TOKEN
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

    let data: string = '';
    let jsonData;
    try {
      data = await new GithubApiV4().queryData(this.accessToken, query);
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
      logger.error({
        class: 'GithubRepoStructure',
        method: 'getRepoStructure',
        action: "Error while trying to obtain the repo's root tree sha.",
        params: {},
        value: error.toString(),
      });
      if (error.toString().includes("abuse detection mechanism")){ 
        throw error;
      }
      return null;
    }

      console.log("returning jsonData.data.repository.object.oid");
    return jsonData.data.repository.object.oid;
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

  //two query are called here. if we want only one, we could call treesha
  // first and pass the result of the previous query(treesha) as parameter here as well.
  async getRepoStructure(
    owner: string,
    repoName: string
  ): Promise<IProjectStructure[]> {
    let data: string = '';
    let projectStructure: {
      fileId: string;
      fileName: string;
      filePath: string;
    }[] = [];
    let jsonData;

    //could also be passed in parameters if we wanted to make it a single query method
    let treeSha: string = await this.getTreeSha(owner, repoName);
    if (!treeSha || treeSha === "null"){
        return [];
    }

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
      logger.error({
        class: 'GithubRepoStructure',
        method: 'getRepoStructure',
        action: "Error while trying to obtain the repo's root tree sha.",
        params: {},
        value: error.toString(),
      });
      if (error.toString().includes("rate-limiting")){ 
        throw error;
      }
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
