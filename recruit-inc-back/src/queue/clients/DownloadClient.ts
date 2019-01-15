import { IGithubClient } from './IGithubClient';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { GithubDownloadedFilesPath } from '../../data-extraction/github/githubDownloadedFilesPath';

export class DownloadClient implements IGithubClient {
  private owner: string;
  private repository: string;
  private path: string;

  public constructor(prospect: RequiredClientInformation) {
    this.owner = prospect.repoOwner;
    this.repository = prospect.repoName;
    this.path = prospect.filePath;
  }

  async executeQuery() {
    let downloads: GithubDownloadedFilesPath = new GithubDownloadedFilesPath();

    let downlaodedFile = await downloads.downloadFile(
      this.owner,
      this.repository,
      this.path
    );

    //TODO: Save to database
  }
}
