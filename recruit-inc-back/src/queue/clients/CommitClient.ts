import { IGithubClient } from './IGithubClient';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { GithubUserCommits } from '../../data-extraction/github/githubUserCommits';

export class CommitClient implements IGithubClient {
  private owner: string;
  private repository: string;
  private userId: string;

  public constructor(propsect: RequiredClientInformation) {
    this.owner = propsect.repoOwner;
    this.repository = propsect.repoName;
    this.userId = propsect.user.id;
  }

  executeQuery() {
    let commits: GithubUserCommits = new GithubUserCommits();

    commits.getCommits(this.repository, this.owner, this.userId);

    //TODO: Save to database
    //TODO: Populate Files Affected queue
  }
}
