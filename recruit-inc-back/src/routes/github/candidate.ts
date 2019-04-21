import { Request, Response } from 'express';
import { GithubUserInfo } from '../../data-extraction/github/githubUserInfo';
import { GithubUserRepos } from '../../data-extraction/github/githubUserRepos';
import { GithubRepoStructure } from '../../data-extraction/github/githubRepoStructure';
import { GithubDownloadedFilesPath } from '../../data-extraction/github/githubDownloadedFilesPath';
import { IGithubUser } from '../../data-extraction/github/api-entities/IGithubUser';
import { GithubDataExtraction } from '../../data-extraction/github/githubDataExtraction';
import { IGitProjectSummary } from '../../matching-algo/data-model/output-model/IGitProjectSummary';
import { GithubUsersTDG } from '../../data-source/table-data-gateway/githubUsersTDG';
import { GithubUsersFinder } from '../../data-source/finder/GithubUsersFinder';
import { IGithubUserModel } from '../../domain/model/IGithubUserModel';
import { IGithubProjectInput } from '../../matching-algo/data-model/input-model/IGithubProjectInput';
import { ISourceFiles } from '../../matching-algo/data-model/input-model/ISourceFiles';
import { CronFinder } from '../../data-source/finder/CronFinder';
import { ICronModel } from '../../domain/model/ICronModel';
import { Status } from '../../domain/model/ICronModel';
import { Logger } from '../../Logger';
import { CronJobs } from '../../cron-job/CronJobs';
import { Controller } from '../../queue/Controller';
import { GithubUserCommits } from '../../data-extraction/github/githubUserCommits';
const logger = new Logger();
const { fork } = require('child_process');

export class Candidate {
  public routes(app): void {
    let users: IGithubUser[];

    app.route('/process').get(async (request: Request, response: Response) => {
      let controller: Controller = Controller.get_instance();
      await controller.processUsers();
      response.sendStatus(200);
    });
    app.route('/scan').get(async (request: Request, response: Response) => {
      let cronjob: CronJobs = new CronJobs();
      await cronjob.scan();
      response.sendStatus(200);
    });

    app
      .route('/getUsersDB/:location')
      .get(async (request: Request, response: Response) => {
        let location: string = request.params.location;
        let githubUsersFinder: GithubUsersFinder = new GithubUsersFinder();
        let result: IGithubUserModel[] = await githubUsersFinder.findByLocation(
          location
        );
        response.status(200).send(result);
      });

    app
      .route('/addToWatchlist/:location')
      .get(async (request: Request, response: Response) => {
        let location: string = request.params.location;
        let cronjob: CronJobs = new CronJobs();
        let finished: boolean = await cronjob.addToWatchlist(location);

        response.sendStatus(200);
      });
  }
}
