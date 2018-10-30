import { GithubApiV4} from "./githubApiV4";
import { GithubApiV3} from "./githubApiV3";
import {IGithubUser} from "./api-entities/IGithubUser"

const fs = require('fs');
const logger = require('../../logger.js');

export class GithubDownloadedFilesPath {
    private readonly accessToken: string;
    
    public constructor(accessToken: string = "37780cb5a0cd8bbedda4c9537ebf348a6e402baf" ) {
      this.accessToken = accessToken;
  }

    async downloadFile(owner: string, repoName: string, path: string): Promise<{name: string, path: string, content: string}> {
        let data ;
        let jsonData;
       try{
        data = await new GithubApiV3().downloadFile(this.accessToken, owner, repoName, path);
        jsonData = JSON.parse(data);
        if (jsonData.content == null)
            throw new TypeError('The file you are trying to download does not exist.');
        }catch(error){
          logger.error({class: "GithubDownloadedFilesPath", method: "downloadFile", action: "Error while trying to obtain the contents of a file.", value: error.toString()}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
            return data;
        }
        let content = Buffer.from(jsonData.content, 'base64').toString();

        return {name: jsonData.name, path: jsonData.path, content: content};
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
        if (user.dataEntry.projectInputs == null || user.dataEntry.projectInputs.length == 0){
            return user;
        }
        for (let repository of user.dataEntry.projectInputs){
            if(!(repository.downloadedSourceFile)){
                repository.downloadedSourceFile = [];
            }
            if (repository.projectStructure == null || repository.projectStructure.length == 0){
                continue;
            }
            for (let file of repository.projectStructure){
                if (file.fileName == filename){
                    let generatedPath : string = this.generatePath(user.login, repository.projectName, file.filePath);
                    let sourceFile : {name: string, path: string, content: string} = await this.downloadFile(repository.owner, repository.projectName, file.filePath);
                    this.writeToFile(sourceFile.content, generatedPath);
                    repository.downloadedSourceFile.push({filename: sourceFile.name, repoFilePath: sourceFile.path, localFilePath: generatedPath });
                }
            }
        
        }
        return user;
    }

}

