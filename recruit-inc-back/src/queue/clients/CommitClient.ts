import { IGithubClient } from './IGithubClient';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { GithubUserCommits } from '../../data-extraction/github/githubUserCommits';

export class CommitClient implements IGithubClient {
  private owner: string;
  private repository: string;
  private userId: string;
  private prospect: RequiredClientInformation;

  public constructor(propsect: RequiredClientInformation) {
    this.owner = propsect.repoOwner;
    this.repository = propsect.repoName;
    this.userId = propsect.user.id;
    this.prospect = propsect;
  }

  async executeQuery() {
    let commits: GithubUserCommits = new GithubUserCommits();

    let allCommits = await commits.getCommits(
      this.repository,
      this.owner,
      this.userId
    );

    //Loop through all commits to update RequiredClientInformation and pass to files affected queue
    for (let singleCommit of allCommits) {
      this.prospect.commitId = singleCommit.id;

      //TODO: Populate Files Affected queue
    }

    //TODO: Save to database
  }
}
