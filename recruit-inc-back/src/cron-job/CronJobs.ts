import { GithubUserInfo } from '../data-extraction/github/githubUserInfo';
import { CronTime, CronJob } from 'cron';
import { GithubDataExtraction } from '../data-extraction/github/githubDataExtraction';
import { ICronModel } from '../domain/model/ICronModel'
import { CronTDG } from '../data-source/table-data-gateway/cronTDG'
import { CronFinder } from '../data-source/finder/CronFinder'
import { Status } from '../domain/model/ICronModel'
import { IGithubUsersModel } from '../domain/model/IGithubUsersModel'
import { IGithubUser } from '../data-extraction/github/api-entities/IGithubUser'
import { GithubUsersTDG } from '../data-source/table-data-gateway/githubUsersTDG'
const { fork } = require('child_process');

export class CronJobs {
    private githubUserInfo: GithubUserInfo = new GithubUserInfo();
    private cronTDG: CronTDG = new CronTDG();
    private githubUsersTDG: GithubUsersTDG = new GithubUsersTDG();
    private cronFinder: CronFinder = new CronFinder();

    public async scheduleCron(location: string) {

        let total_number: number = await this.githubUserInfo.getUserCountForLocation(location);

         let cron : ICronModel = {
            location: location.toLowerCase(),
            number_scanned: 0,
            total_number: total_number,
            cron_pattern: '',
            status: Status.locationscan
        };

         cron = await this.cronTDG.create(cron);
         await this.preliminaryScan(location);
         //Update status to scanning
         cron.status = Status.scanning;
         await this.cronTDG.update(cron._id, cron);
    }

    async preliminaryScan(location: string){
        //Do this here or start a separate process that does it and saves to db?
        let githubUsers : IGithubUser[] = await this.githubUserInfo.getUserByLocation(location);
        let githubUsersModel : IGithubUsersModel = {
            githubUsers : githubUsers,
            location: location.toLowerCase()
        }
        this.githubUsersTDG.create(githubUsersModel);
    } 

    async scan(location: string){
        //Call a different function
    }

    async stopScan(location: string){
         let cron : ICronModel = await this.cronFinder.findByLocation(location);
         //Update cron status
         cron.status = Status.canceled;
         await this.cronTDG.update(cron._id, cron);
         //Return number of users scanned?
    }

  locationScan(
    cronTime: CronTime,
    query: GithubUserInfo,
    location: string
  ): { forked: any , job: CronJob } {
    const CronJob = require('cron').CronJob;

    const forked = fork('src/data-extraction/github/githubUserInfo.ts');
    const job = new CronJob(cronTime, async function() {
      forked.send(location);
      //await query.getUserByLocation(location);
    }, {onComplete: function(){
        console.log('done too');
        forked.send('STOP');
    }});
    job.start();

    return {forked , job};
  }

  userScan(
    cronTime: CronTime,
    query: GithubDataExtraction,
    login: string,
    email: string = ''
  ): CronJob {
    const CronJob = require('cron').CronJob;
    const job = new CronJob(cronTime, async function() {
      await query.matchGithubUser(login, email);
    });
    job.start();

    return job;
  }
}
