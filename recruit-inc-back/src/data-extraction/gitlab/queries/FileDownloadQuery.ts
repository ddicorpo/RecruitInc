import {IGitlabQueryExecutor} from "../query-executor/IGitlabQueryExecutor";
import {AbstractGitlabQuery} from "./AbstractGitlabQuery";

const fs = require('fs');

export class FileDownloadQuery extends AbstractGitlabQuery<any>{
    private projectId: number;
    private fileSha1: string;

    public constructor(projectId: number, fileSha1: string, queryExecutor: IGitlabQueryExecutor<any>){
        super(queryExecutor);
        this.projectId = projectId;
        this.fileSha1 = fileSha1;
    }

    public buildQuery(): void {
        this.query = this.queryExecutor.getBaseGitlabApi() + "projects/" + this.projectId + "/repository/blobs/" + this.fileSha1 + "/raw";
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
        return `downloaded/${username}/gitlab/${repoName}/${filePath}`;
    }

    






}
