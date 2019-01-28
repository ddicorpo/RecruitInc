import { IGithubClient } from './IGithubClient';
import { GithubUserRepos } from '../../data-extraction/github/githubUserRepos';
import { IGithubProjectInput } from '../../matching-algo/data-model/input-model/IGithubProjectInput';
import { GithubUsersTDG } from '../../data-source/table-data-gateway/githubUsersTDG';
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
    let githubUserRepos: GithubUserRepos = new GithubUserRepos(
      this.accessToken
    );

    //modifies the user, which means duplicate data stored in db
    //Need a method that simply returns repos
    let allRepos: IGithubProjectInput[] = await githubUserRepos.getRepos(this.prospect.user);

    // pull the instances of treeQueue and CommitQueue to be populated later
    let treeQueue = TreeQueue.get_instance();
    let commitQueue = CommitQueue.get_instance();

    for (let repo of allRepos) {
      this._prospect.repoName = repo.projectName;
      this._prospect.repoOwner = repo.owner;
      //Replace first position of projectInputs with current repo in order to simplify functionality withing treeQueue
      this._prospect.user.dataEntry.projectInputs[0] = repo;

      //enqueue takes the requiredInfo package "prospect" and passes it to the appropriate queue
      treeQueue.enqueue(this._prospect);
      commitQueue.enqueue(this._prospect);
    }

    //TODO: Store this information in db,
    //Store all Repos for the user in db -> in RepositoryClient or GihubUsers?
    //GithubUsers to have centralized data
    await this.updateUser(this._prospect.user.login, allRepos);

  }
 
  public async updateUser(login: string, projectInputs: IGithubProjectInput[] ){
      let githubUsersTDG: GithubUsersTDG = new GithubUsersTDG();
      let criteria: any = {
          "githubUsers.login": login,
          githubUsers: {
              $elemMatch: {
                  login: login
              }
          }
      }

      let update: any = {
          $set: {"githubUsers.$[gU].dataEntry": { projectInputs: projectInputs}}
      }

      //Not really necessary in this case
      let options = {
          arrayFilters: [{"gU.login": login}]
      } 

      await githubUsersTDG.generalUpdate(criteria, update, options);

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
