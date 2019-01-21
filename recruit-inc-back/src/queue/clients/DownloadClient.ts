import { IGithubClient } from './IGithubClient';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { GithubDownloadedFilesPath } from '../../data-extraction/github/githubDownloadedFilesPath';

export class DownloadClient implements IGithubClient {
  private _owner: string;
  private _repository: string;
  private _path: string;

  public constructor(prospect: RequiredClientInformation) {
    this._owner = prospect.repoOwner;
    this._repository = prospect.repoName;
    this._path = prospect.filePath;
  }

  async executeQuery() {
    let downloads: GithubDownloadedFilesPath = new GithubDownloadedFilesPath();

    let downlaodedFile = await downloads.downloadFile(
      this._owner,
      this._repository,
      this._path
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

  get path(): string {
    return this._path;
  }

  set path(value: string) {
    this._path = value;
  }
}
