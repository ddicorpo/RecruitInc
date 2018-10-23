import { GithubApiV4} from "./githubApiV4";
import { GithubApiV3} from "./githubApiV3";
import {IGithubUser} from "./api-entities/IGithubUser"

const path = require('path');

export class GithubRepoStructure {
    private readonly accessToken: string;
    
    public constructor(accessToken: string = "37780cb5a0cd8bbedda4c9537ebf348a6e402baf" ) {
      this.accessToken = accessToken;
  }

    async getTreeSha(owner: string, repoName: string): Promise<string> {
        let query : string =
            `query {
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
        for (let repository of user.repositories){
            repository.structure = await this.getRepoStructure(repository.owner.login, repository.name);
        }
        return user;
    }

    async getRepoStructure(owner: string, repoName: string): Promise<{sha: string, name: string, path: string}[]> {
        let data : string = "";
        let treeSha : string = "";
        let projectStructure : {sha: string, name: string, path: string}[] = [];
        let jsonData;

        try{
            data = await this.getTreeSha(owner, repoName);
            jsonData = JSON.parse(data);
            console.log(jsonData);
            if (jsonData.data == null || jsonData.data.repository == null)
                throw new TypeError('Either you do not have access to the repository you are trying to query or it does not exist');

        }catch(e){
            console.log(e);
            return;
        }

        treeSha = jsonData.data.repository.object.oid;
        try{
            data = await new GithubApiV3().getGitTree(this.accessToken, owner, repoName, treeSha);
            jsonData = JSON.parse(data);
            if (!(jsonData.hasOwnProperty('tree')))
                throw new TypeError('Either you do not have access to the repository you are trying to query or it does not exist');
        }catch(e){
            console.log(e);
            return;
        }

        let tree = jsonData.tree;
        //only include blobs in project structure
        for (let file of tree){
            if (file.type == 'blob')
                projectStructure.push({sha: file.sha, name: path.basename(file.path), path: file.path });
        }
        
        return projectStructure;

    }
}
