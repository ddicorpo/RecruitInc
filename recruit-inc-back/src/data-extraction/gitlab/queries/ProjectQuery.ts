interface IProjectQuery extends IGitlabQuery<IGitlabProject[]> {
    userId: number,
}

export class ProjectQuery implements IProjectQuery{
    query: string;
    userId: number;
    queryExecutor: IGitlabQueryExecutor<IGitlabProject[]>;
    response: IGitlabProject[];

    public constructor(userId: number, queryExecutor: IGitlabQueryExecutor<IGitlabProject[]>){
        this.userId = userId;
        this.queryExecutor = queryExecutor;
    }

    public buildQuery(): void {
        this.query = this.queryExecutor.baseGitlabApi + "users/" + this.userId + "/projects?statistics=true";
    }

    public getQuery(): string {
        return this.query;
    }

    public executeQuery(): IGitlabProject[] {
        this.response = this.queryExecutor.executeQuery(this.query);
        return this.response;
    }
}
