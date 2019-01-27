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
import { GithubUsersFinder } from '../data-source/finder/GithubUsersFinder'
const { fork } = require('child_process');

export class CronJobs {
    private githubUserInfo: GithubUserInfo = new GithubUserInfo();
    private cronTDG: CronTDG = new CronTDG();
    private githubUsersTDG: GithubUsersTDG = new GithubUsersTDG();
    private cronFinder: CronFinder = new CronFinder();
    private githubUsersFinder: GithubUsersFinder = new GithubUsersFinder();

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

    //Put this in a real cronjob (with library)?
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
        let githubUsersModel : IGithubUsersModel = await this.githubUsersFinder.findByLocation(location);
        let githubUsers : IGithubUser[] = githubUsersModel.githubUsers; 
        for (let user of githubUsers){
        
        }
        //Call queue controller
    }

    async stopScan(location: string){
         let cron : ICronModel = await this.cronFinder.findByLocation(location);
         //Update cron status
         cron.status = Status.canceled;
         await this.cronTDG.update(cron._id, cron);
         //Return number of users scanned?
    }

}
