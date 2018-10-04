import {IGitlabQueryExecutor} from "../query-executor/IGitlabQueryExecutor";
import {AbstractGitlabQuery} from "./AbstractGitlabQuery";
import {IGitlabCommitDiff} from "../api-entities/IGitlabCommitDiff";

export class CommitDiffQuery extends AbstractGitlabQuery<IGitlabCommitDiff[]>{
    private projectId: number;
    private commitSha1: string;

    public constructor(projectId: number, commitSha1: string, queryExecutor: IGitlabQueryExecutor<IGitlabCommitDiff[]>){
        super(queryExecutor);
        this.projectId = projectId;
        this.commitSha1 = commitSha1;
    }

    public buildQuery(): void {
        this.query = this.queryExecutor.getBaseGitlabApi() + "projects/" + this.projectId + "/repository/commits/" + this.commitSha1 + "/diff";
    }
}
