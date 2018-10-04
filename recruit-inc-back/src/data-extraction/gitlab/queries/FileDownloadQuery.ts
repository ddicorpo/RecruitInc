interface IFileDownloadQuery extends IGitlabQuery<any> {
    projectId: number,
    fileSha1: string
}

export class FileDownloadQuery implements IFileDownloadQuery{
    query: string;
    projectId: number;
    fileSha1: string;
    queryExecutor: IGitlabQueryExecutor<any>;
    response: any;

    public constructor(projectId: number, fileSha1: string, queryExecutor: IGitlabQueryExecutor<any>){
        this.projectId = projectId;
        this.fileSha1 = fileSha1;
        this.queryExecutor = queryExecutor;
    }

    public buildQuery(): void {
        this.query = this.queryExecutor.baseGitlabApi + "projects/" + this.projectId + "/repository/blobs/" + this.fileSha1 + "/raw";
    }

    public getQuery(): string {
        return this.query;
    }

    public executeQuery(): any {
        this.response = this.queryExecutor.executeQuery(this.query);
        return this.response;
    }
}
