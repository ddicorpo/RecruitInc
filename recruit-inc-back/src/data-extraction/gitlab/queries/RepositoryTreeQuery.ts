import {IGitlabQueryExecutor} from "../query-executor/IGitlabQueryExecutor";
import {AbstractGitlabQuery} from "./AbstractGitlabQuery";
import {IGitlabRepositoryTree} from "../api-entities/IGitlabRepositoryTree";

export class RepositoryTreeQuery extends AbstractGitlabQuery<IGitlabRepositoryTree[]>{
    private projectId: number;

    public constructor(projectId: number, queryExecutor: IGitlabQueryExecutor<IGitlabRepositoryTree[]>){
        super(queryExecutor);
        this.projectId = projectId;
    }

    public buildQuery(): void {
        this.query = this.queryExecutor.getBaseGitlabApi() + "projects/" + this.projectId + "/repository/tree?recursive=true";
    }
}