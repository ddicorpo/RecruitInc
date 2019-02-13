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
import { Controller } from '../queue/Controller'
const { fork } = require('child_process');

export class CronJobs {
    private githubUserInfo: GithubUserInfo = new GithubUserInfo();
    private cronTDG: CronTDG = new CronTDG();
    private githubUsersTDG: GithubUsersTDG = new GithubUsersTDG();
    private cronFinder: CronFinder = new CronFinder();
    private githubUsersFinder: GithubUsersFinder = new GithubUsersFinder();
    private controller: Controller = Controller.get_instance();

    public async scheduleCron(location: string): Promise<boolean> {
        let cron: ICronModel = await this.cronFinder.findByLocation(location);
        if (cron){
            await this.scan();
            return true; //Cronjob already exists for location
        }

        let total_number: number = await this.githubUserInfo.getUserCountForLocation(location);

         cron = {
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
         await this.scan();
         //Update status to scanned
         cron.status = Status.complete;
         await this.cronTDG.update(cron._id, cron);
         return true;
    }

    //Put this in a real cronjob (with library)?
    async preliminaryScan(location: string){
        //Do this here or start a separate process that does it and saves to db?
        let githubUsers : IGithubUser[] = await this.githubUserInfo.getUserByLocation(location);
        let githubUsersModel : IGithubUsersModel = {
            githubUsers : githubUsers,
            location: location.toLowerCase()
        }
        await this.githubUsersTDG.create(githubUsersModel);
    } 

    async scan(){
        await this.controller.execute();
    }

    async stopScan(location: string){
         let cron : ICronModel = await this.cronFinder.findByLocation(location);
         //Update cron status
         cron.status = Status.canceled;
         await this.cronTDG.update(cron._id, cron);
         //Return number of users scanned?
    }

}