import {IGitlabQueryExecutor} from "../query-executor/IGitlabQueryExecutor";
import {AbstractGitlabQuery} from "./AbstractGitlabQuery";

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
}
