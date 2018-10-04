interface ICommitQuery extends IGitlabQuery<IGitlabCommit[]> {
    projectId: number,
}

export class CommitQuery implements ICommitQuery{
    query: string;
    projectId: number;
    queryExecutor: IGitlabQueryExecutor<IGitlabCommit[]>;
    response: IGitlabCommit[];

    public constructor(projectId: number, queryExecutor: IGitlabQueryExecutor<IGitlabCommit[]>){
        this.projectId = projectId;
        this.queryExecutor = queryExecutor;
    }

    public buildQuery(): void {
        this.query = this.queryExecutor.baseGitlabApi + "projects/" + this.projectId + "/repository/commits?all=true&with_stats=true";
    }

    public getQuery(): string {
        return this.query;
    }

    public executeQuery(): IGitlabCommit[] {
        this.response = this.queryExecutor.executeQuery(this.query);
        return this.response;
    }
}
