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
            oid
            type
            name
          }
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

    async getRepoStructure(owner: string, repoName: string): Promise<{oid: string, type: string, name: string}[]> {

        let data : string = "";
        let jsonData;
        let projectStructure : any[] = [] ;
        try{
        data = await this.query(owner, repoName);
        console.log(data);
        console.log("Inside getRepoStructure. NANI!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        jsonData = JSON.parse(data);
        if (jsonData.data == null || jsonData.data.repository == null)
            throw new TypeError('Either you do not have access to the repository you are trying to query or it does not exist');
        }catch(e){

         console.log(e); 
         return projectStructure;

        }
        let projectRoot : any[] = jsonData.data.repository.object.entries;
        await this.extractFiles(projectRoot, projectStructure, owner, repoName, 0);
        
            return projectStructure;
    }

     async extractFiles(input : any[] , files : any[] , owner: string, repoName: string, count: number): Promise<any[]> {

        if (input.length == 0){
           return files;
        }
        
        let file = input.pop();
        if (file.type == 'blob'){
            files.push(file);
        }else{
        let data : string = "";
        let jsonData;
        let path : string = file.name+'/';
        try{
        data = await this.query(owner, repoName, null , path);
        jsonData = JSON.parse(data);
        if (jsonData.data == null || jsonData.data.repository == null)
            throw new TypeError('Something went wrong');
        }catch(e){
            console.log(e);
            return files;

        }
        console.log("Inside extractFiles "+count);
        let newFiles = jsonData.data.repository.object.entries;
        for (let f of newFiles){

            f.name = `${path}${f.name}`;
            input.push(f);
        }
        }

        await this.extractFiles(input, files, owner, repoName, count+=1);
    }
}
