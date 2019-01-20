import { GithubApiV4 } from '../githubApiV4';
import { GithubApiV3 } from '../githubApiV3';
import { IGithubUser } from '../api-entities/IGithubUser';
import { Logger } from '../../../Logger';

const logger = new Logger();

const path = require('path');

export class GithubRepoStructureSingleQuery {
  private readonly accessToken: string;

  public constructor(
    accessToken: string = process.env.GITHUB_DEFAULT_AUTH_TOKEN
  ) {
    this.accessToken = accessToken;
  }

  //Called from the TreeShaQueue, return treeSha string
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
      return null;
    }

    return jsonData.data.repository.object.oid;
  }

  //Called by the TreeQueue,  return the project structure(the tree)
  async getRepoStructure(
    owner: string,
    repoName: string,
    treeSha: string
  ): Promise<{ fileId: string; fileName: string; filePath: string }[]> {
    let data: string = '';
    let projectStructure: {
      fileId: string;
      fileName: string;
      filePath: string;
    }[] = [];
    let jsonData;

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
      return [];
    }

    let tree = jsonData.tree;
    //only include blobs in project structure
    for (let file of tree) {
      if (file.type == 'blob') {
        projectStructure.push({
          fileId: file.sha,
          fileName: path.basename(file.path),
          filePath: file.path,
        });
      }
    }

    return projectStructure;
  }
}
