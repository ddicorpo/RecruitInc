import { IGithubUser } from '../data-extraction/github/api-entities/IGithubUser';
import { IGithubUserModel } from '../domain/model/IGithubUserModel';
import { IGitProjectSummary } from '../matching-algo/data-model/output-model/IGitProjectSummary';
import { RequiredClientInformation } from './RequiredClientInformation';
import { RepositoryQueue } from './queues/RepositoryQueue';
import { TreeQueue } from './queues/TreeQueue';
import { CommitQueue } from './queues/CommitQueue';
import { DownloadQueue } from './queues/DownloadQueue';
import { FilesAffectedByQueue } from './queues/FilesAffectedByQueue';
import { GithubUsersFinder } from '../data-source/finder/GithubUsersFinder';
import { GithubDataExtraction } from '../data-extraction/github/githubDataExtraction';
import { Logger } from '../Logger';
import {
  GithubUserSchema,
  ScanningStatus,
} from '../data-source/schema/githubUserSchema';
import { GithubUsersTDG } from '../data-source/table-data-gateway/githubUsersTDG';
import { tokens } from '../../tokenlist.json';
import { IncreaseScanUserCommand } from '../domain/command/IncreaseScanUserCommand';
import { InsertCandidateCommand } from '../domain/command/InsertCandidateCommand';
import { IApplicantModel, UserType } from '../domain/model/IApplicantModel';
import { IGitModel } from '../domain/model/IGitModel';
import { IGitDataModel, Platform } from '../domain/model/IGitDataModel';
import { ITokenModel } from '../domain/model/ITokenModel';

export class Controller {
  private static _instance: Controller;
  public githubTokens = tokens;
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
  private increaseByOneCommand: IncreaseScanUserCommand = new IncreaseScanUserCommand();
  private insertCandidateCommand: InsertCandidateCommand = new InsertCandidateCommand();
  private logger: Logger;

  //main method, runs all the queues and finds the information
  public async execute() {
    // Here we reload the queues with unfinished elements that remained from last time.
    this.reloadQueues();

    let usersSchemas: GithubUserSchema[] = await this.fetchUsersFromDatabase();

    let canStillScan: boolean =
      usersSchemas.length !== 0 || !this.areQueuesEmpty(); //Bug here if no scannable users found it database but there is still a user in the queues this should be true
    if (!canStillScan) return;

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

    //Assuming above bug is fixed: if user is still in downloadQueue canStillScan becomes false and user scan isn't completed
    while (canStillScan) {
      //Checking for empty queues here causes infinite loop
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

  public async processUsers() {
    let githubUsersFinder: GithubUsersFinder = new GithubUsersFinder();
    let githubDataExtractor: GithubDataExtraction = new GithubDataExtraction();
    let githubUserModels: IGithubUserModel[] = await githubUsersFinder.findByStatus(
      ScanningStatus.completed
    );

    let githubUsersTDG: GithubUsersTDG = new GithubUsersTDG();
    let summary: IGitProjectSummary;
    for (let user of githubUserModels) {
      if (!user.githubUser.dataEntry) continue;
      if (user.githubUser.projectSummary) continue; //Has already been processed

      summary = githubDataExtractor.processUser(user.githubUser);

      if (!summary) continue;
      user.scanningStatus = ScanningStatus.analyzed;
      await githubUsersTDG.update(user._id, user);
      if (summary != undefined && summary != null) {
        // Safe attempt to add user in candidate table and increase the counter...
        try {
          //We do not log info in here since we will log all in command class...

          const newCandidate: IApplicantModel = this.convertToCandidate(
            user,
            summary
          );
          const increaseByOneStatus: Boolean = await this.increaseByOneCommand.increasedByOne(
            user.location
          );
          const insertCandidateStatus: Boolean = await this.insertCandidateCommand.insertCandidate(
            newCandidate
          );

          if (increaseByOneStatus) {
            this.handleLog(
              this.fetchSpecificUserFromDatabase.name,
              'Successfully increased the number of scan user by one'
            );
          }

          if (insertCandidateStatus) {
            this.handleLog(
              this.fetchSpecificUserFromDatabase.name,
              'Successfully insert new candidate to candidates table'
            );
          }
        } catch (Exception) {
          this.handleLog(
            this.fetchSpecificUserFromDatabase.name,
            'Problem while adding data to other table...' + Exception.message
          );
        }
      }

      let criteria: any = { 'githubUser.login': user.githubUser.login };
      let update: any = { $set: { 'githubUser.projectSummary': summary } };
      await githubUsersTDG.generalUpdate(criteria, update);
    }
  }

  private handleLog(method: string, error: string) {
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
        await this.repoQueue.processNextQuery(this.githubTokens[0]);
      }
    } catch (e) {
      this.handleLog('executeRepo', e.toString());
      canStillScan = false;
    }
    return canStillScan;
  }

  private async executeTree(): Promise<boolean> {
    let canStillScan: boolean = true;
    try {
      while (this.treeQueue.size() > 0) {
        await this.treeQueue.processNextQuery(this.githubTokens[0]);
      }
    } catch (e) {
      this.handleLog('executeTree', e.toString());
      canStillScan = false;
    }
    return canStillScan;
  }

  private async executeCommit(): Promise<boolean> {
    let canStillScan: boolean = true;
    try {
      while (this.commitQueue.size() > 0) {
        await this.commitQueue.processNextQuery(this.githubTokens[0]);
      }
    } catch (e) {
      this.handleLog('executeCommit', e.toString());
      canStillScan = false;
    }
    return canStillScan;
  }

  private async executeFilesAffected(): Promise<boolean> {
    let canStillScan: boolean = true;
    try {
      while (this.filesAffectedByQueue.size() > 0) {
        await this.filesAffectedByQueue.processNextQuery(this.githubTokens[0]);
      }
    } catch (e) {
      this.handleLog('executeExecuteFilesAffected', e.toString());
      canStillScan = false;
    }
    return canStillScan;
  }

  private async executeDownload(): Promise<boolean> {
    let canStillScan: boolean = true;
    try {
      while (this.downloadQueue.size() > 0) {
        await this.downloadQueue.processNextQuery(this.githubTokens[0]);
      }
    } catch (e) {
      this.handleLog('executeDownload', e.toString());
      canStillScan = false;
    }
    return canStillScan;
  }
  private convertToCandidate(user: any, summary: any): IApplicantModel {
    //Prevent error since table applicant expect email
    const email: string =
      user.githubUser.email != undefined && user.githubUser.email.length > 2
        ? user.github.email
        : this.hashCode(user.githubUser.login);
    const gitDataModel: IGitDataModel = {
      dataEntry: user.githubUser.dataEntry,
      gitProjectSummary: summary,
      lastKnownInfoDate: user.githubUser.createdAt,
      platform: Platform.Github,
    };
    //We assume token will be emptu
    const token: ITokenModel = {
      platform: Platform.Github,
      AccessToken: '',
      RefreshToken: '',
      ExpiryDate: '',
    };
    const gitModel: IGitModel = {
      IGitData: [gitDataModel],
      IToken: token,
    };
    const newCandidate: IApplicantModel = {
      platformUsername: user.githubUser.login,
      platformEmail: email,
      iGit: gitModel,
      userType: UserType.Candidate,
    };

    return newCandidate;
  }

  //Function from https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0
  private hashCode(username: string) {
    var h = 0,
      l = username.length,
      i = 0;
    if (l > 0) while (i < l) h = ((h << 5) - h + username.charCodeAt(i++)) | 0;
    return h.toString();
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
  //take the top token in the array, and push it to the bottom
  public rotateKeys() {
    let temp = this.githubTokens.pop();
    this.githubTokens.push(temp);
  }
}
