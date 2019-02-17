import { IGithubClient } from './IGithubClient';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { GithubUserCommits } from '../../data-extraction/github/githubUserCommits';
import { FilesAffectedByQueue } from "../queues/FilesAffectedByQueue";
import { GithubUsersTDG } from '../../data-source/table-data-gateway/githubUsersTDG';
import { ICommit } from '../../matching-algo/data-model/input-model/ICommit';

export class CommitClient implements IGithubClient {
  public owner: string;
  public repository: string;
  public userId: string;
  public projectUrl: string;
  public prospect: RequiredClientInformation;

  public constructor(prospect: RequiredClientInformation) {
    this.owner = prospect.repoOwner;
    this.repository = prospect.repoName;
    this.userId = prospect.user.id;
    this.projectUrl = prospect.projectUrl;
    this.prospect = prospect;
  }

  async executeQuery() {
    let commits: GithubUserCommits = new GithubUserCommits();
    let allCommits: ICommit[] = [];

    try{
    allCommits = await commits.getCommits(
      this.repository,
      this.owner,
      this.userId
    );
    } catch (error){
        throw error;
    }
    //pull the filesAffectedByQueue instance, so that we can populate its queue in this method
    let filesAffected = FilesAffectedByQueue.get_instance();

    //Loop through all commits to update RequiredClientInformation and pass to files affected queue
    for (let singleCommit of allCommits) {
      this.prospect.commitId = singleCommit.id;
      //pass the updated requiredInfo package to the filesAffectedQueue
      filesAffected.enqueue(this.prospect);
    }

    //TODO: Save to database
    await this.updateUser(this.prospect.user.login, this.projectUrl, allCommits);
  }

  public async updateUser(login: string, projectUrl: string, allCommits: ICommit[] ){
      let githubUsersTDG: GithubUsersTDG = new GithubUsersTDG();
      let criteria: any = { "githubUser.login": login }
      let update: any = {
          $set: {"githubUser.dataEntry.projectInputs.$[pi].applicantCommits": allCommits }
      }
      let options = {                         //Might cause issues if user contributes to several project with same name
          arrayFilters: [{"pi.url": projectUrl}]
      }

      await githubUsersTDG.generalUpdate(criteria, update, options);
  
  }

}
