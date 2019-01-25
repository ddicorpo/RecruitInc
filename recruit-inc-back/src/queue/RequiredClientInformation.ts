import { IGithubUser } from '../data-extraction/github/api-entities/IGithubUser';

export class RequiredClientInformation {
  private _user: IGithubUser;
  private _repoName: string;
  private _repoOwner: string;
  private _repoToken: string;
  private _filePath: string;
  private _commitId: string;
  private _location: string;

  public constructor(
    user: IGithubUser,
    repoName: string,
    repoOwner: string,
    filePath: string,
    commitId: string,
    location: string
  ) {
    this._user = user;
    this._repoName = repoName;
    this._repoOwner = repoOwner;
    this._filePath = filePath;
    this._commitId = commitId;
    this._repoToken = process.env.GITHUB_DEFAULT_AUTH_TOKEN;
    this._location = location;
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

  get filePath(): string {
    return this._filePath;
  }

  set filePath(value: string) {
    this._filePath = value;
  }

  get commitId(): string {
    return this._commitId;
  }

  set commitId(value: string) {
    this._commitId = value;
  }

  get location(): string {
    return this._location;
  }

  set location(value: string) {
    this._location = value;
  }
}
