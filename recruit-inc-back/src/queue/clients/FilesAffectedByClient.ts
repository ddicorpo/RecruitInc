import { IGithubClient } from './IGithubClient';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { GithubUserCommits } from '../../data-extraction/github/githubUserCommits';

export class FilesAffectedByClient implements IGithubClient {
  private _owner: string;
  private _repository: string;
  private _commitId: string;

  public constructor(prospect: RequiredClientInformation) {
    this._owner = prospect.repoOwner;
    this._repository = prospect.repoName;
    this._commitId = prospect.commitId;
  }

  async executeQuery() {
    let affected: GithubUserCommits = new GithubUserCommits();

    let allAffectedFiles = await affected.getFilesAffectedByCommit(
      this._owner,
      this._repository,
      this._commitId
    );

    //TODO: Save to database
  }

  get owner(): string {
    return this._owner;
  }

  set owner(value: string) {
    this._owner = value;
  }

  get repository(): string {
    return this._repository;
  }

  set repository(value: string) {
    this._repository = value;
  }

  get commitId(): string {
    return this._commitId;
  }

  set commitId(value: string) {
    this._commitId = value;
  }
}
