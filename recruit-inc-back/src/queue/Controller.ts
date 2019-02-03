import { IGithubUser } from '../data-extraction/github/api-entities/IGithubUser';
import { RequiredClientInformation } from './RequiredClientInformation';
import { RepositoryQueue } from './queues/RepositoryQueue';
import { TreeQueue } from './queues/TreeQueue';
import { CommitQueue } from './queues/CommitQueue';
import { DownloadQueue } from './queues/DownloadQueue';
import { FilesAffectedByQueue } from './queues/FilesAffectedByQueue';
import { GithubUsersFinder } from '../data-source/finder/GithubUsersFinder';
import { GithubUsersTDG } from '../data-source/table-data-gateway/githubUsersTDG';
import { IGithubUsersModel } from '../domain/model/IGithubUsersModel';
import { CronFinder } from '../data-source/finder/CronFinder';
import { ICronModel } from '../domain/model/ICronModel';
import { Status } from '../domain/model/ICronModel';
import { Logger } from '../Logger';

export class Controller {
  private static _instance: Controller;

  private constructor() {
    this.logger = new Logger();
  }

  public static get_instance() {
    return this._instance || (this._instance = new this());
  }

  private repoQueue: RepositoryQueue = RepositoryQueue.get_instance();
  private treeQueue: TreeQueue = TreeQueue.get_instance();
  private commitQueue: CommitQueue = CommitQueue.get_instance();
  private downloadQueue: DownloadQueue = DownloadQueue.get_instance();
  private filesAffectedByQueue: FilesAffectedByQueue = FilesAffectedByQueue.get_instance();
  private logger: Logger;

  //main method, runs all the queues and finds the information
  public async execute() {
    // Here we reload the queues with unfinished elements that remained from last time.
    this.reloadQueues();

    let users: IGithubUser[] = await this.fetchUsersFromDatabase();

    if (this.areQueuesEmpty()) {
      this.enqueueUser(users.pop());
    }

    let canStillScan: boolean = true;
    while (canStillScan) {
      canStillScan = await this.executeRepo();

      if (canStillScan) {
        canStillScan = await this.executeTree();
      }
      //if (canStillScan) {
      //  canStillScan = this.executeCommit();
      //}
      //if (canStillScan) {
      //  canStillScan = this.executeFilesAffected();
      //}
      //if (canStillScan) {
      //  canStillScan = this.executeDownload();
      //}

      if (canStillScan) {
        //console.log("users at this point: ", users);
        if (users.length === 0){ //fixing the cannot read login of undefined error because a user is still enqueued even though the users array is empty
            canStillScan = false;
            continue;
        }
        this.enqueueUser(users.pop());
      }
    }
    //this.executeRepo();
    //this.executeTree();
    //this.executeCommit();
    //this.executeFilesAffected();
    //this.executeFilesAffected();
    //this.executeDownload();
  }

  private enqueueUser(user: IGithubUser): void {
      //console.log("enqueueing user:", user);
    const prospect: RequiredClientInformation = new RequiredClientInformation(
      user,
      '',
      '',
      '',
      '',
      ''
    );
    this.repoQueue.enqueue(prospect);
  }

  private areQueuesEmpty(): boolean {
    return (
      this.repoQueue.isEmpty() &&
      this.treeQueue.isEmpty() &&
      this.commitQueue.isEmpty() &&
      this.downloadQueue.isEmpty() &&
      this.filesAffectedByQueue.isEmpty()
    );
  }

  public async fetchUsersFromDatabase(): Promise<IGithubUser[]> {
      let githubUsers: IGithubUser[] = [];
      let githubUsersTDG: GithubUsersTDG = new GithubUsersTDG();
      let cronFinder: CronFinder = new CronFinder();
      //Find all crons with "scanning" status
      let scanning: ICronModel[] = await cronFinder.findByStatus(Status.scanning)
      //console.log("scanning",scanning);

      //For all crons found, get their locations
      for (let crons of scanning){
      let pipeline = [
          {$match: {location: crons.location}},
          {
              $project:{
                  "githubUsers": {
                      $filter: {
                      input: "$githubUsers",
                      as: "githubUser",
                      cond: {"$eq": [{$type:"$$githubUser.dataEntry"}, "missing"]}
                  }}
              }
          }
      ]
      //console.log("pipeline: ",pipeline);
          //For each location found find unscanned users (with no dataEntry)
          let unscannedUsers: any = await githubUsersTDG.findUnscannedUsers(pipeline);
          //console.log("unscannedUsers: ", unscannedUsers[0].githubUsers);
          githubUsers = githubUsers.concat(unscannedUsers[0].githubUsers);
      }
      //console.log("users",githubUsers);
      return githubUsers;
    // Check whether there are unfinished users to be scanned
    // Get all the locations that are currently in scanning status from db
    // Get all the users from those locations that should be scanned
  }

  private handleError(method: string, error: string) {
    this.logger.info({
      class: 'Controller.ts',
      method,
      action: 'Github is either down or we ran out of queries.',
      params: {},
      value: { error },
    });
    this.storeQueues();
  }

  private async executeRepo(): Promise<boolean> {
    //  console.log("executing repo -------------------------------------------");
      console.log("repoQueue size: ", this.repoQueue.size());
      console.log("repoQueue", this.repoQueue);
    let canStillScan: boolean = true;
    try {
      while (this.repoQueue.size() > 0) {
        await this.repoQueue.processNextQuery();
      }
    } catch (e) {
      this.handleError('executeRepo', e.toString());
      canStillScan = false;
    }
    return canStillScan;
  }

  private async executeTree(): Promise<boolean> {
    //  console.log("executing tree -------------------------------------------");
      console.log("treeQueue size: ", this.treeQueue.size());
      console.log("treeQueue", this.treeQueue);
    let canStillScan: boolean = true;
    try {
      while (this.treeQueue.size() > 0) {
        await this.treeQueue.processNextQuery();
      }
    } catch (e) {
      this.handleError('executeTree', e.toString());
      canStillScan = false;
    }
    return canStillScan;
  }

  private executeCommit(): boolean {
    let canStillScan: boolean = true;
    try {
      while (this.commitQueue.size() > 0) {
        this.commitQueue.processNextQuery();
      }
    } catch (e) {
      this.handleError('executeCommit', e.toString());
      canStillScan = false;
    }
    return canStillScan;
  }

  private executeFilesAffected(): boolean {
    let canStillScan: boolean = true;
    try {
      while (this.filesAffectedByQueue.size() > 0) {
        this.filesAffectedByQueue.processNextQuery();
      }
    } catch (e) {
      this.handleError('executeExecuteFilesAffected', e.toString());
      canStillScan = false;
    }
    return canStillScan;
  }

  private executeDownload(): boolean {
    let canStillScan: boolean = true;
    try {
      while (this.downloadQueue.size() > 0) {
        this.downloadQueue.processNextQuery();
      }
    } catch (e) {
      this.handleError('executeDownload', e.toString());
      canStillScan = false;
    }
    return canStillScan;
  }

  //load back all queues from DB
  private async reloadQueues() {
    await this.repoQueue.loadFromDatabase();
    await this.treeQueue.loadFromDatabase();
    await this.commitQueue.loadFromDatabase();
    await this.filesAffectedByQueue.loadFromDatabase();
    await this.downloadQueue.loadFromDatabase();
  }

  //store all queues in db, mostly used in case of error
  private async storeQueues() {
    await this.repoQueue.saveToDatabase();
    await this.treeQueue.saveToDatabase();
    await this.commitQueue.saveToDatabase();
    await this.filesAffectedByQueue.saveToDatabase();
    await this.downloadQueue.saveToDatabase();
  }
}
