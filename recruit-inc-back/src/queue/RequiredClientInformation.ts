import { IGithubUser } from '../data-extraction/github/api-entities/IGithubUser';
import { IGithubProjectInput } from '../matching-algo/data-model/input-model/IGithubProjectInput';

export class RequiredClientInformation {
  private _user: IGithubUser;
  private _repoName: string;
  private _repoOwner: string;
  private _repoToken: string;
  private _treeSha: string;

  public constructor(
    user: IGithubUser,
    repoName: string,
    repoOwner: string,
    treeSha: string
  ) {
    this._user = user;
    this._repoName = repoName;
    this._repoOwner = repoOwner;
    this._treeSha = treeSha;
    this._repoToken = process.env.GITHUB_DEFAULT_AUTH_TOKEN;
  }

  get user(): IGithubUser {
    return this._user;
  }

  get repoName(): string {
    return this._repoName;
  }

  get repoOwner(): string {
    return this._repoOwner;
  }

  get repoToken(): string {
    return this._repoToken;
  }

  get treeSha(): string {
    return this._treeSha;
  }
}
