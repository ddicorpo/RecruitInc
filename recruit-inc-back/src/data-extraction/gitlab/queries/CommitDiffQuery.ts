interface ICommitDiffQuery extends IGitlabQuery<IGitlabCommitDiff[]> {
    projectId: number,
    commitSha1: string
}

export class CommitDiffQuery implements ICommitDiffQuery{
    query: string;
    projectId: number;
    commitSha1: string;
    queryExecutor: IGitlabQueryExecutor<IGitlabCommitDiff[]>;
    response: IGitlabCommitDiff[];

    public constructor(projectId: number, commitSha1: string, queryExecutor: IGitlabQueryExecutor<IGitlabCommitDiff[]>){
        this.projectId = projectId;
        this.commitSha1 = commitSha1;
        this.queryExecutor = queryExecutor;
    }

    public buildQuery(): void {
        this.query = this.queryExecutor.baseGitlabApi + "projects/" + this.projectId + "/repository/commits/" + this.commitSha1 + "/diff";
    }

    public getQuery(): string {
        return this.query;
    }

    public executeQuery(): IGitlabCommitDiff[] {
        this.response = this.queryExecutor.executeQuery(this.query);
        return this.response;
    }
}
