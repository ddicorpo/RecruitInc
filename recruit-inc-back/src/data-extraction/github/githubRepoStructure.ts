import { GithubApiV4} from "./githubApiV4";
import {IGithubUser} from "./api-entities/IGithubUser"

export class GithubRepoStructure {
    private readonly accessToken: string;
    
    public constructor(accessToken: string = "37780cb5a0cd8bbedda4c9537ebf348a6e402baf" ) {
      this.accessToken = accessToken;
  }

    async query(owner: string, repoName: string, oid: string = null, path: string = null): Promise<string> {
        let query : string =
            `query {
  repository(owner: "${owner}", name: "${repoName}"){
    name
    object(expression: "master:${path ?  `${path}` : '' }"${oid ? `, oid: "${oid}"` : '' }){ 
        ... on Tree{ 
          entries{
            mode
            type
            name
            oid
          }
        }
      }
    }
  }`;

        return await new GithubApiV4().queryData(this.accessToken, query);
    }

    async getRepoStructure(owner: string, repoName: string): Promise<any[]> {

        let data : string = await this.query(owner, repoName);
        let jsonData = JSON.parse(data);
        let projectRoot : any[] = jsonData.data.repository.object.entries;
        let projectStructure : any[] = [] ;
        await this.extractFiles(projectRoot, projectStructure, owner, repoName);
        
            return projectStructure;
    }

     async extractFiles(input : any[] , files : any[] , owner: string, repoName: string): Promise<any[]> {

        if (input.length == 0){
           return files;
        }
        
        let file = input.pop();
        if (file.type == 'blob'){
            files.push(file);
        }else{
        let path : string = file.name+'/';
        let data : string = await this.query(owner, repoName, null , path);
        let jsonData = JSON.parse(data);
        let newFiles = jsonData.data.repository.object.entries;
        for (let f of newFiles){
            f.name = `${path}${f.name}`;
            input.push(f);
        }
        }

        await this.extractFiles(input, files, owner, repoName);
    }
}
