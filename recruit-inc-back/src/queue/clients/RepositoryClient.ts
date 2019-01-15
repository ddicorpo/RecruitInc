import { IGithubClient } from './IGithubClient';
import { IGithubUser } from '../../data-extraction/github/api-entities/IGithubUser';
import { GithubUserRepos } from '../../data-extraction/github/githubUserRepos';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { TreeQueue } from "../queues/TreeQueue";
import { CommitQueue } from "../queues/CommitQueue";

export class RepositoryClient implements IGithubClient {
  private readonly accessToken: string;
  private username: string;
  private prospect: RequiredClientInformation;

  public constructor(prospect: RequiredClientInformation) {
    this.accessToken = prospect.repoToken;
    this.username = prospect.user.login;
    this.prospect = prospect;
  }

  //executeQuery(username: string, githubUser: IGithubUser, token?: string) {}
  async executeQuery() {
    let user: IGithubUser = {
      login: this.username,
      createdAt: '',
      url: '',
      email: '',
    };

    let githubUserRepos: GithubUserRepos = new GithubUserRepos(
      this.accessToken
    );

    let allRepos = await githubUserRepos.getUserRepos(user);

    // pull the instances of treeQueue and CommitQueue to be populated later
    let treeQueue = TreeQueue.get_instance();
    let commitQueue = CommitQueue.get_instance();

    for (let repo of allRepos.dataEntry.projectInputs) {
      this.prospect.repoName = repo.projectName;
      this.prospect.repoOwner = repo.owner;
      //Replace first position of projectInputs with current repo in order to simplify functionality withing treeQueue
      this.prospect.user.dataEntry.projectInputs[0] = repo;

      //enqueue takes the requiredInfo package "prospect" and passes it to the appropriate queue
      treeQueue.enqueue(this.prospect);
      commitQueue.enqueue(this.prospect);

    }

    //TODO: Store this information in db,
  }
}
