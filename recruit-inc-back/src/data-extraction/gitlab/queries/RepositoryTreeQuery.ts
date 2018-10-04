interface IRepositoryTreeQuery extends IGitlabQuery<IGitlabRepositoryTree[]> {
    projectId: number,
}

export class RepositoryTreeQuery implements IRepositoryTreeQuery{
    query: string;
    projectId: number;
    queryExecutor: IGitlabQueryExecutor<IGitlabRepositoryTree[]>;
    response: IGitlabRepositoryTree[];

    public constructor(projectId: number, queryExecutor: IGitlabQueryExecutor<IGitlabRepositoryTree[]>){
        this.projectId = projectId;
        this.queryExecutor = queryExecutor;
    }

    public buildQuery(): void {
        this.query = this.queryExecutor.baseGitlabApi + "projects/" + this.projectId + "/repository/tree?recursive=true";
    }

    public getQuery(): string {
        return this.query;
    }

    public executeQuery(): IGitlabRepositoryTree[] {
        this.response = this.queryExecutor.executeQuery(this.query);
        return this.response;
    }
}
