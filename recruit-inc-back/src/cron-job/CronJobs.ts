import { GithubUserInfo } from '../data-extraction/github/githubUserInfo';
import { CronTime, CronJob } from 'cron';
import { GithubDataExtraction } from '../data-extraction/github/githubDataExtraction';

export class CronJobs {
  locationScan(
    cronTime: CronTime,
    query: GithubUserInfo,
    location: string
  ): CronJob {
    const CronJob = require('cron').CronJob;

    const job = new CronJob(cronTime, async function() {
      await query.getUserByLocation(location);
    });
    job.start();

    return job;
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
