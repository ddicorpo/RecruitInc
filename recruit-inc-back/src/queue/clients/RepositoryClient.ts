import { IGithubClient } from './IGithubClient';
import { IGithubUser } from '../../data-extraction/github/api-entities/IGithubUser';
import { GithubUserRepos } from '../../data-extraction/github/githubUserRepos';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { TreeQueue } from "../queues/TreeQueue";
import { CommitQueue } from "../queues/CommitQueue";

export class RepositoryClient implements IGithubClient {
  private readonly accessToken: string;
  private _username: string;
  private _prospect: RequiredClientInformation;

  public constructor(prospect: RequiredClientInformation) {
    this.accessToken = prospect.repoToken;
    this._username = prospect.user.login;
    this._prospect = prospect;
  }

  //executeQuery(username: string, githubUser: IGithubUser, token?: string) {}
  async executeQuery() {
    let user: IGithubUser = {
      login: this._username,
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
      this._prospect.repoName = repo.projectName;
      this._prospect.repoOwner = repo.owner;
      //Replace first position of projectInputs with current repo in order to simplify functionality withing treeQueue
      this._prospect.user.dataEntry.projectInputs[0] = repo;

      //enqueue takes the requiredInfo package "prospect" and passes it to the appropriate queue
      treeQueue.enqueue(this._prospect);
      commitQueue.enqueue(this._prospect);
    }

    //TODO: Store this information in db,
  }


  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get prospect(): RequiredClientInformation {
    return this._prospect;
  }

  set prospect(value: RequiredClientInformation) {
    this._prospect = value;
  }
}
