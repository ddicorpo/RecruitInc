interface IUserQuery extends IGitlabQuery<IGitlabUser[]> {
    username: string,
}

export class UserQuery implements IUserQuery{
    query: string;
    username: string;
    queryExecutor: IGitlabQueryExecutor<IGitlabUser[]>;
    response: IGitlabUser[];

    public constructor(username: string, queryExecutor: IGitlabQueryExecutor<IGitlabUser[]>){
        this.username = username;
        this.queryExecutor = queryExecutor;
    }

    public buildQuery(): void {
        this.query = this.queryExecutor.baseGitlabApi + "users?username=" + this.username;
    }

    public getQuery(): string {
        return this.query;
    }

    public executeQuery(): IGitlabUser[] {
        this.response = this.queryExecutor.executeQuery(this.query);
        return this.response;
    }
}
