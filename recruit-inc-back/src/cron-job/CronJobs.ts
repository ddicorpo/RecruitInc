import { GithubUserInfo } from '../data-extraction/github/githubUserInfo';
import { CronTime, CronJob } from 'cron';
import { GithubDataExtraction } from '../data-extraction/github/githubDataExtraction';
const { fork } = require('child_process');

export class CronJobs {
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
