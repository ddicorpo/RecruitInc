import { IGithubUser } from '../data-extraction/github/api-entities/IGithubUser';
import { RequiredClientInformation } from './RequiredClientInformation';
import { RepositoryQueue } from './queues/RepositoryQueue';
import { TreeQueue } from './queues/TreeQueue';
import { CommitQueue } from './queues/CommitQueue';
import { DownloadQueue } from './queues/DownloadQueue';
import { FilesAffectedByQueue } from './queues/FilesAffectedByQueue';
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
  public execute() {
    // Here we reload the queues with unfinished elements that remained from last time.
    this.reloadQueues();

    let users: IGithubUser[] = this.fetchUsersFromDatabase();

    if (this.areQueuesEmpty()) {
      this.enqueueUser(users.pop());
    }

    let canStillScan: boolean = true;
    while (canStillScan) {
      canStillScan = this.executeRepo();

      if (canStillScan) {
        canStillScan = this.executeTree();
      }
      if (canStillScan) {
        canStillScan = this.executeCommit();
      }
      if (canStillScan) {
        canStillScan = this.executeFilesAffected();
      }
      if (canStillScan) {
        canStillScan = this.executeDownload();
      }

      if (canStillScan) {
        this.enqueueUser(users.pop());
      }
    }
  }

  private enqueueUser(user: IGithubUser): void {
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

  private fetchUsersFromDatabase(): IGithubUser[] {
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

  private executeRepo(): boolean {
    let canStillScan: boolean = true;
    try {
      while (this.repoQueue.size() > 0) {
        this.repoQueue.processNextQuery();
      }
    } catch (e) {
      this.handleError('executeRepo', e.toString());
      canStillScan = false;
    }
    return canStillScan;
  }

  private executeTree(): boolean {
    let canStillScan: boolean = true;
    try {
      while (this.treeQueue.size() > 0) {
        this.treeQueue.processNextQuery();
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
