import { GithubApiV4} from "./githubApiV4";
import { GithubApiV3} from "./githubApiV3";
import {IGithubUser} from "./api-entities/IGithubUser"

const fs = require('fs');

export class GithubDownloadedFilesPath {
    private readonly accessToken: string;
    
    public constructor(accessToken: string = "37780cb5a0cd8bbedda4c9537ebf348a6e402baf" ) {
      this.accessToken = accessToken;
  }

    async downloadFile(owner: string, repoName: string, path: string): Promise<string> {
        let data ;
        let jsonData;
       try{
        data = await new GithubApiV3().downloadFile(this.accessToken, owner, repoName, path);
        jsonData = JSON.parse(data);
        if (jsonData.content == null)
            throw new TypeError('Something went wrong');
        }catch(e){
            console.log(e);
            return data;
        }
        let content = Buffer.from(jsonData.content, 'base64').toString();

        return content;
    }
    
    writeToFile(content: string, path: string){
        let notExist = path.split('/');
        let exists : string = "";
        for (let i = 0; i < notExist.length-1; i++){
            exists+=`${notExist[i]}/`;
            if (fs.existsSync(exists))
                continue;
            else
                fs.mkdirSync(exists);
        }

        fs.writeFile(path, content, (err)=>{
            if (err) throw err;
        });
    }

    generatePath(username: string, repoName: string, filePath: string) : string {
        return `downloaded/${username}/github/${repoName}/${filePath}`;
    }

    async downloadFileForUser(user: IGithubUser, filename: string): Promise<IGithubUser>{
        if (user.repositories == null || user.repositories.length == 0)
            return user;
        for (let repository of user.repositories){
            if (repository.structure == null || repository.structure.length == 0)
                continue;
            for (let file of repository.structure){
                if (file.name == filename){
                    let generatedPath : string = this.generatePath(user.login, repository.name, file.path);
                    let fileContent : string = await this.downloadFile(repository.owner.login, repository.name, file.path);
                    this.writeToFile(fileContent, generatedPath);
                    if(!(repository.downloadedSourceFilePaths))
                        repository.downloadedSourceFilePaths = [];
                    repository.downloadedSourceFilePaths.push(generatedPath);
                }
            }
        
        }
        return user;
    }

}

