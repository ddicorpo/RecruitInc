import { IGithubUser } from '../data-extraction/github/api-entities/IGithubUser';

export class RequiredClientInformation {
  private _user: IGithubUser;
  private _repoName: string;
  private _repoOwner: string;
  private _repoToken: string;

  public constructor(user: IGithubUser, repoName: string, repoOwner: string) {
    this._user = user;
    this._repoName = repoName;
    this._repoOwner = repoOwner;
    this._repoToken = process.env.GITHUB_DEFAULT_AUTH_TOKEN;
  }

  get user(): IGithubUser {
    return this._user;
  }

  set user(value: IGithubUser) {
    this._user = value;
  }

  get repoName(): string {
    return this._repoName;
  }

  set repoName(value: string) {
    this._repoName = value;
  }

  get repoOwner(): string {
    return this._repoOwner;
  }

  set repoOwner(value: string) {
    this._repoOwner = value;
  }

  get repoToken(): string {
    return this._repoToken;
  }

  set repoToken(value: string) {
    this._repoToken = value;
  }
}
