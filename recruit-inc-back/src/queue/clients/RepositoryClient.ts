import { IGithubClient } from './IGithubClient';
import { GithubUserRepos } from '../../data-extraction/github/githubUserRepos';
import { IGithubProjectInput } from '../../matching-algo/data-model/input-model/IGithubProjectInput';
import { GithubUsersTDG } from '../../data-source/table-data-gateway/githubUsersTDG';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { TreeQueue } from '../queues/TreeQueue';
import { CommitQueue } from '../queues/CommitQueue';

export class RepositoryClient implements IGithubClient {
  public readonly accessToken: string;
  public username: string;
  public prospect: RequiredClientInformation;

  public constructor(prospect: RequiredClientInformation) {
    this.accessToken = prospect.repoToken;
    this.username = prospect.user.login;
    this.prospect = prospect;
  }

  //executeQuery(username: string, githubUser: IGithubUser, token?: string) {}
  async executeQuery(token: string) {
    let githubUserRepos: GithubUserRepos = new GithubUserRepos(token);
    let allRepos: IGithubProjectInput[] = [];

    //modifies the user, which means duplicate data stored in db
    //Need a method that simply returns repos
    try {
      allRepos = await githubUserRepos.getRepos(this.prospect.user);
    } catch (error) {
      throw error;
    }

    // pull the instances of treeQueue and CommitQueue to be populated later
    let treeQueue = TreeQueue.get_instance();
    let commitQueue = CommitQueue.get_instance();

    for (let repo of allRepos) {
      let newProspect: RequiredClientInformation = new RequiredClientInformation(
        this.prospect.user,
        repo.projectName,
        repo.owner,
        '',
        '',
        '',
        repo.url
      );

      treeQueue.enqueue(newProspect);
      commitQueue.enqueue(newProspect);
    }

    //TODO: Store this information in db,
    //Store all Repos for the user in db -> in RepositoryClient or GihubUsers?
    //GithubUsers to have centralized data
    await this.updateUser(this.prospect.user.login, allRepos);
    //await treeQueue.saveToDatabase();
  }

  public async updateUser(login: string, projectInputs: IGithubProjectInput[]) {
    let githubUsersTDG: GithubUsersTDG = new GithubUsersTDG();
    let criteria: any = { 'githubUser.login': login };

    let update: any = {
      $set: { 'githubUser.dataEntry': { projectInputs: projectInputs } },
    };

    await githubUsersTDG.generalUpdate(criteria, update);
  }
}
