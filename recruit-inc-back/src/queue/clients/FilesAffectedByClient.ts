import { IGithubClient } from './IGithubClient';
import { IGithubUser } from '../../data-extraction/github/api-entities/IGithubUser';

export class FilesAffectedByClient implements IGithubClient {
    private owner: string;
    private repository: string;
    private userId: string;

    //executeQuery(username: string, githubUser: IGithubUser, token?: string) {}
    executeQuery() {}
}