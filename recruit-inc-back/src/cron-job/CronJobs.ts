import { GithubUserInfo } from '../data-extraction/github/githubUserInfo';
import { CronTime, CronJob } from 'cron';
import { GithubDataExtraction } from '../data-extraction/github/githubDataExtraction';
import { ICronModel } from '../domain/model/ICronModel';
import { CronTDG } from '../data-source/table-data-gateway/cronTDG';
import { CronFinder } from '../data-source/finder/CronFinder';
import { Status } from '../domain/model/ICronModel';
import { IGithubUserModel } from '../domain/model/IGithubUserModel';
import { IGithubUser } from '../data-extraction/github/api-entities/IGithubUser';
import { GithubUsersTDG } from '../data-source/table-data-gateway/githubUsersTDG';
import { GithubUsersFinder } from '../data-source/finder/GithubUsersFinder';
import { Controller } from '../queue/Controller';
import { ScanningStatus } from '../data-source/schema/githubUserSchema';
const { fork } = require('child_process');

export class CronJobs {
  private githubUserInfo: GithubUserInfo = new GithubUserInfo();
  private cronTDG: CronTDG = new CronTDG();
  private githubUsersTDG: GithubUsersTDG = new GithubUsersTDG();
  private cronFinder: CronFinder = new CronFinder();
  private githubUsersFinder: GithubUsersFinder = new GithubUsersFinder();
  private controller: Controller = Controller.get_instance();
  private controllerRunning: boolean = false;

  //Default crontime: checks to see if the controller is running or not
  //Explanation: Run at second 0, minute 0, hour 0, every day, every month, from sunday to saturday
  public async scheduleCron(cronTime: CronTime = '0 0 */2 * * 0-6'): CronJob {
    const CronJob = require('cron').CronJob;
    let cronjobs: CronJobs = new CronJobs();
    const job = new CronJob(cronTime, async function() {
      await cronjobs.scan();
    });
    job.start();

    return job;
  }

  //for key rotations at every time minutes = 20
  public async cronKeyRotation(
    cronTime: CronTime = '0 */20 * * * 0-6'
  ): CronJob {
    const CronJob = require('cron').CronJob;

    let controller: Controller = Controller.get_instance();
    const job = new CronJob(cronTime, function() {
      controller.rotateKeys();
    });
    job.start();

    return job;
  }
  //launches the matching algo every 5 hours
  public async updateMatchingAlgo(
    //cronTime: CronTime = '0 0 0 * * 0-6'
    cronTime: CronTime = '0 0 */5 * * 0-6'
    //cronTime: CronTime = '0 21 20 * * 0-6'
  ): CronJob {
    const CronJob = require('cron').CronJob;

    let controller: Controller = Controller.get_instance();
    const job = new CronJob(cronTime, async function() {
      await controller.processUsers();
    });
    job.start();

    return job;
  }

  public async addToWatchlist(location: string): Promise<boolean> {
    let cron: ICronModel = await this.cronFinder.findByLocation(location);
    if (cron) {
      return true; //Cronjob already exists for location
    }

    let total_number: number = await this.githubUserInfo.getUserCountForLocation(
      location
    );

    cron = {
      location: location.toLowerCase(),
      number_scanned: 0,
      total_number: total_number,
      cron_pattern: '',
      status: Status.locationscan,
    };

    cron = await this.cronTDG.create(cron);
    await this.preliminaryScan(location);
    //Update status to scanning
    cron.status = Status.scanning;
    await this.cronTDG.update(cron._id, cron);
    return true;
  }

  //Put this in a real cronjob (with library)?
  async preliminaryScan(location: string) {
    //Do this here or start a separate process that does it and saves to db?
    let githubUsers: IGithubUser[] = await this.githubUserInfo.getUserByLocation(
      location
    );
    let githubUsersModel: IGithubUserModel[] = [];
    for (const githubUser of githubUsers) {
      let githubUserModel: IGithubUserModel = {
        githubUser,
        location: location.toLowerCase(),
        scanningStatus: ScanningStatus.pending,
      };
      githubUsersModel.push(githubUserModel);
    }
    await this.githubUsersTDG.insertMany(githubUsersModel);
  }

  async scan() {
    if (!this.controllerRunning) {
      this.controllerRunning = true;
      await this.controller.execute();
      this.controllerRunning = false;
    }
  }

  async stopScan(location: string) {
    let cron: ICronModel = await this.cronFinder.findByLocation(location);
    //Update cron status
    cron.status = Status.canceled;
    await this.cronTDG.update(cron._id, cron);
    //Return number of users scanned?
  }
}
