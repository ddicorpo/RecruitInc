import { IGithubClient } from './IGithubClient';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { GithubUserCommits } from '../../data-extraction/github/githubUserCommits';

export class FilesAffectedByClient implements IGithubClient {
  private owner: string;
  private repository: string;
  private commitId: string;

  public constructor(prospect: RequiredClientInformation) {
    this.owner = prospect.repoOwner;
    this.repository = prospect.repoName;
    this.commitId = prospect.commitId;
  }

  executeQuery() {
    let affected: GithubUserCommits = new GithubUserCommits();

    affected.getFilesAffectedByCommit(
      this.owner,
      this.repository,
      this.commitId
    );

    //TODO: Save to database
  }
}
