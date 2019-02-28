import { IGithubUser } from '../data-extraction/github/api-entities/IGithubUser';
import { RequiredClientInformation } from './RequiredClientInformation';
import { RepositoryQueue } from './queues/RepositoryQueue';
import { TreeQueue } from './queues/TreeQueue';
import { CommitQueue } from './queues/CommitQueue';
import { DownloadQueue } from './queues/DownloadQueue';
import { FilesAffectedByQueue } from './queues/FilesAffectedByQueue';
import { GithubUsersFinder } from '../data-source/finder/GithubUsersFinder';
import { Logger } from '../Logger';
import {
  GithubUserSchema,
  ScanningStatus,
} from '../data-source/schema/githubUserSchema';
import { GithubUsersTDG } from '../data-source/table-data-gateway/githubUsersTDG';

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

    let usersSchemas: GithubUserSchema[] = await this.fetchUsersFromDatabase();

    let canStillScan: boolean = usersSchemas.length !== 0;
    let currentUserSchema: GithubUserSchema = null;
    if (usersSchemas.length !== 0) {
      if (this.areQueuesEmpty()) {
        currentUserSchema = usersSchemas.pop();
        this.enqueueUser(currentUserSchema.githubUser);
      } else {
        const githubUsername: string = this.getUsername();
        currentUserSchema = await this.fetchSpecificUserFromDatabase(
          githubUsername
        );
      }
    }

    // UPDATING THE STATUS OF THE GITHUB USER TO REFLECT THAT THE SCAN STARTED
    currentUserSchema.scanningStatus = ScanningStatus.started;
    const githubTDG: GithubUsersTDG = new GithubUsersTDG();
    const githubUserFinder: GithubUsersFinder = new GithubUsersFinder();
    githubTDG.update(currentUserSchema._id, currentUserSchema);
    // **********************************************************************

    while (canStillScan) {
      canStillScan = await this.executeRepo();

      if (canStillScan) {
        canStillScan = await this.executeTree();
      }
      if (canStillScan) {
        canStillScan = await this.executeCommit();
      }
      if (canStillScan) {
        canStillScan = await this.executeFilesAffected();
      }
      if (canStillScan) {
        canStillScan = await this.executeDownload();
      }

      // UPDATING THE STATUS OF THE GITHUB USER TO REFLECT THAT THE SCAN COMPLETED OR WAS INTERRUPTED
      currentUserSchema = (await githubUserFinder.findById(
        currentUserSchema._id
      )) as GithubUserSchema;
      if (canStillScan) {
        // Here we update the database to notify that the object has been completly processed
        currentUserSchema.scanningStatus = ScanningStatus.completed;
      } else {
        currentUserSchema.scanningStatus = ScanningStatus.paused;
      }
      githubTDG.update(currentUserSchema._id, currentUserSchema);
      // ********************************************************************************************

      if (canStillScan) {
        //console.log("users at this point: ", users);
        if (usersSchemas.length === 0) {
          //fixing the cannot read login of undefined error because a user is still enqueued even though the users array is empty
          canStillScan = false;
          continue;
        } else {
          currentUserSchema = usersSchemas.pop();
          currentUserSchema.scanningStatus = ScanningStatus.started;
          githubTDG.update(currentUserSchema._id, currentUserSchema);

          this.enqueueUser(currentUserSchema.githubUser);
        }
      }
    }
  }

  private enqueueUser(user: IGithubUser): void {
    //console.log("enqueueing user:", user);
    const prospect: RequiredClientInformation = new RequiredClientInformation(
      user,
      '',
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

  private getUsername(): string {
    if (!this.repoQueue.isEmpty()) {
      return this.repoQueue.getUsername();
    }
    if (!this.treeQueue.isEmpty()) {
      return this.treeQueue.getUsername();
    }
    if (!this.commitQueue.isEmpty()) {
      return this.commitQueue.getUsername();
    }
    if (!this.downloadQueue.isEmpty()) {
      return this.downloadQueue.getUsername();
    }
    if (!this.filesAffectedByQueue.isEmpty()) {
      return this.filesAffectedByQueue.getUsername();
    }
  }

  public async fetchUsersFromDatabase(): Promise<GithubUserSchema[]> {
    let githubUsersFinder: GithubUsersFinder = new GithubUsersFinder();

    let query = { 'githubUser.dataEntry': null };
    //Find unscanned users (with no dataEntry)
    let unscannedUsers: any = await githubUsersFinder.generalFind(query);
    return unscannedUsers;
  }

  public async fetchSpecificUserFromDatabase(
    username: string
  ): Promise<GithubUserSchema> {
    let githubUsersFinder: GithubUsersFinder = new GithubUsersFinder();

    let query = { 'githubUser.login': username };
    //Find unscanned users (with no dataEntry)
    let user: any = await githubUsersFinder.generalFind(query);
    if (Array.isArray(user)) {
      return user[0];
    } else {
      return user;
    }
  }

  private handleError(method: string, error: string) {
    //verify that this is a ratelimit error
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

  private async executeCommit(): Promise<boolean> {
    let canStillScan: boolean = true;
    try {
      while (this.commitQueue.size() > 0) {
        await this.commitQueue.processNextQuery();
      }
    } catch (e) {
      this.handleError('executeCommit', e.toString());
      canStillScan = false;
    }
    return canStillScan;
  }

  private async executeFilesAffected(): Promise<boolean> {
    let canStillScan: boolean = true;
    try {
      while (this.filesAffectedByQueue.size() > 0) {
        await this.filesAffectedByQueue.processNextQuery();
      }
    } catch (e) {
      this.handleError('executeExecuteFilesAffected', e.toString());
      canStillScan = false;
    }
    return canStillScan;
  }

  private async executeDownload(): Promise<boolean> {
    let canStillScan: boolean = true;
    try {
      while (this.downloadQueue.size() > 0) {
        await this.downloadQueue.processNextQuery();
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
