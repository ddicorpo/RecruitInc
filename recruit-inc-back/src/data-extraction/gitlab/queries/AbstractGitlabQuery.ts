import {IGitlabQueryExecutor} from "../query-executor/IGitlabQueryExecutor";

export abstract class AbstractGitlabQuery<Response>{
    protected query: string;
    protected queryExecutor: IGitlabQueryExecutor<Response>;
    protected response: Response;

    public constructor(queryExecutor: IGitlabQueryExecutor<Response>){
        this.queryExecutor = queryExecutor;
    }

    public abstract buildQuery(numberOfpages,accessToken): void;

    public getQuery(): string {
        return this.query;
    }

    public async executeQuery(): Promise<Response> {
        this.response = await this.queryExecutor.executeQuery(this.query);
        return await this.response;
    }

    public async executeDownloadQuery(): Promise<Response> {
        this.response = await this.queryExecutor.executeDownloadQuery(this.query);
        return await this.response;
    }

}
