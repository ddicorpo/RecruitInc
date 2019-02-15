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
import { SSL_OP_EPHEMERAL_RSA } from 'constants';
import { CronJobs } from '../../cron-job/CronJobs';
import { Controller } from '../../queue/Controller';
import { RepositoryQueue } from '../../queue/queues/RepositoryQueue';
const logger = new Logger();
const { fork } = require('child_process');

export class Candidate {
  public routes(app): void {
    let users: IGithubUser[];

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
      .route('/testqueue/:location')
      .get(async (request: Request, response: Response) => {
        let location: string = request.params.location;
        let cronjob: CronJobs = new CronJobs();
        let finished: boolean = await cronjob.scheduleCron(location);
        let githubUsersFinder: GithubUsersFinder = new GithubUsersFinder();
        let result: IGithubUserModel[] = await githubUsersFinder.findByLocation(
          location
        );

        response.status(200).send(result);
      });

    app
      .route('/fetchUsersFromDatabase')
      .get(async (request: Request, response: Response) => {
        let controller: Controller = Controller.get_instance();

        let result: IGithubUser[] = await controller.fetchUsersFromDatabase();

        response.status(200).send(result);
      });
    app
      .route('/findScanning')
      .get(async (request: Request, response: Response) => {
        let cronFinder: CronFinder = new CronFinder();

        let result: ICronModel[] = await cronFinder.findByStatus(
          Status.scanning
        );

        response.status(200).send(result);
      });
    app
      .route('/unscannedusers/:location')
      .get(async (request: Request, response: Response) => {
        let location: string = request.params.location;
        let githubUsersTDG: GithubUsersTDG = new GithubUsersTDG();
        let pipeline = [
          { $match: { location: location } },
          {
            $project: {
              githubUsers: {
                $filter: {
                  input: '$githubUsers',
                  as: 'githubUser',
                  //cond: {"$ifNull":["$$githubUser.dataEntry", true]}
                  cond: {
                    $eq: [{ $type: '$$githubUser.dataEntry' }, 'missing'],
                  },
                },
              },
            },
          },
        ];

        let result: any = await githubUsersTDG.findUnscannedUsers(pipeline);

        response.status(200).send(result);
      });

    app
      .route('/downloadFile/:owner/:repoName/:login/*')
      .get(async (request: Request, response: Response) => {
        let owner: string = request.params.owner;
        let login: string = request.params.login;
        let repoName: string = request.params.repoName;
        let path: string = request.params[0];
        let query: GithubDownloadedFilesPath = new GithubDownloadedFilesPath();
        let result: ISourceFiles = await query.downloadSingleFile(
          owner,
          repoName,
          path,
          login
        );
        response.status(200).send(result);
      });

    app
      .route('/find/:login')
      .get(async (request: Request, response: Response) => {
        let login: string = request.params.login;
        let githubUsersTDG: GithubUsersTDG = new GithubUsersTDG();
        let query = {
          'githubUsers.login': login,
        };
        let projection = {
          _id: 0,
          githubUsers: {
            $elemMatch: {
              login: login,
            },
          },
        };

        let result: any = await githubUsersTDG.generalFind(query, projection);

        response.status(200).send(result);
      });

    app.route('/update').get(async (request: Request, response: Response) => {
      let githubUsersTDG: GithubUsersTDG = new GithubUsersTDG();
      let criteria = {
        //location: "nouakchott", <- also works
        'githubUsers.login': 'jemal',
        githubUsers: {
          $elemMatch: {
            login: 'jemal',
          },
        },
      };
      let update = {
        $set: {
          'githubUsers.$[gU].dataEntry.$[dE].applicantCommits.$[aC].files.$[f].lineDeleted': 20,
        },
      };

      let options = {
        arrayFilters: [
          { 'gU.login': 'jemal' },
          { 'dE.owner': 'Lemine' },
          { 'aC.id': '893420fjkds' },
          { 'f.filePath': 'pom.xml' },
        ],
      };
      await githubUsersTDG.generalUpdate(criteria, update, options);

      response.status(200).send('Finished');
    });

    app
      .route('/location/:location')
      .get(async (request: Request, response: Response) => {
        let location: string = request.params.location;
        let cronjob: CronJobs = new CronJobs();
        cronjob.scheduleCron(location);
      });

    app
      .route('/api/github/candidate/hr/:location')
      .get(async (request: Request, response: Response) => {
        let githubUser: IGithubUser[];
        let location: string = request.params.location;
        let query: GithubUserInfo = new GithubUserInfo();
        githubUser = await query.getUserByLocation(location);
        response.status(200).send(githubUser);
      });

    app
      .route('/api/github/candidate/justrepo/:username')
      .get(async (req: Request, res: Response) => {
        let username: string = req.params.username;
        let user: IGithubUser = { login: username, url: '', createdAt: '' };
        let repos: IGithubProjectInput[];
        let query: GithubUserRepos = new GithubUserRepos();
        repos = await query.getRepos(user);

        res.status(200).send(repos);
      });

    app
      .route('/api/github/candidate/repo/:username')
      .get(async (req: Request, res: Response) => {
        let username: string = req.params.username;
        let user: IGithubUser = { login: username, url: '', createdAt: '' };
        let query: GithubUserRepos = new GithubUserRepos();
        user = await query.getUserRepos(user);

        res.status(200).send(user);
      });

    app
      .route('/api/github/candidate/struct/:owner/:repoName')
      .get(async (req: Request, res: Response) => {
        let owner: string = req.params.owner;
        let repoName: string = req.params.repoName;

        let query: GithubRepoStructure = new GithubRepoStructure();
        let projectStructure = await query.getRepoStructure(owner, repoName);
        res.status(200).send(projectStructure);
      });

    app
      .route('/api/github/candidate/structt')
      .get(async (req: Request, res: Response) => {
        let user: IGithubUser = {
          login: 'MewtR',
          createdAt: '',
          url: '',
          dataEntry: {
            projectInputs: [
              {
                projectName: 'MinistocksRework',
                url: 'x',
                owner: 'AyoubeAkaouch',
                applicantCommits: [],
                projectStructure: [],
                downloadedSourceFile: [],
              },
              {
                projectName: 'rufus',
                url: 'x',
                owner: 'MewtR',
                applicantCommits: [],
                projectStructure: [],
                downloadedSourceFile: [],
              },
            ],
          },
        };

        let query: GithubRepoStructure = new GithubRepoStructure();
        user = await query.getRepoStructureFromUser(user);
        res.status(200).send(user);
      });

    app
      .route('/api/github/candidate/download/:owner/:repoName/*')
      .get(async (req: Request, res: Response) => {
        console.log(req.params);
        let owner: string = req.params.owner;
        let repoName: string = req.params.repoName;
        let query: GithubDownloadedFilesPath = new GithubDownloadedFilesPath();
        let path: string = req.params[0];
        let data = await query.downloadFile(owner, repoName, path);
        query.writeToFile(
          data.content,
          query.generatePath('MewtR', repoName, path)
        );
        res.status(200).send(data);
      });
    app
      .route('/api/github/candidate/downloadforuser')
      .get(async (req: Request, res: Response) => {
        let user: IGithubUser = {
          login: 'MewtR',
          createdAt: '',
          url: '',
          dataEntry: {
            projectInputs: [
              {
                projectName: 'RecruitInc',
                url: 'x',
                owner: 'ddicorpo',
                applicantCommits: [],
                projectStructure: [],
                downloadedSourceFile: [],
              },
              {
                projectName: 'SOEN343',
                url: 'x',
                owner: 'gprattico',
                applicantCommits: [],
                projectStructure: [],
                downloadedSourceFile: [],
              },
            ],
          },
        };

        //Use MewtR's access token to get data from private repo (RecruitInc)
        let githubDownloadedFilesPath: GithubDownloadedFilesPath = new GithubDownloadedFilesPath(
          process.env.GITHUB_DEFAULT_AUTH_TOKEN
        );
        let githubRepoStructure: GithubRepoStructure = new GithubRepoStructure(
          process.env.GITHUB_DEFAULT_AUTH_TOKEN
        );
        user = await githubRepoStructure.getRepoStructureFromUser(user);
        user = await githubDownloadedFilesPath.downloadFileForUser(user);
        res.status(200).send(user);
      });

    app
      .route('/api/githubainofevents/:login/:accessToken?')
      .get(async (req: Request, res: Response) => {
        let login: string = req.params.login;
        let accessToken: string = req.params.accessToken;

        let githubDataExtractor: GithubDataExtraction;

        if (accessToken) {
          githubDataExtractor = new GithubDataExtraction(accessToken);
        } else {
          githubDataExtractor = new GithubDataExtraction();
        }
        let user: IGithubUser = await githubDataExtractor.extractData(login);

        res.status(200).send(user);
        console.log(user);
      });

    app
      .route('/api/github/matchingalgo/:login/:accessToken?')
      .get(async (req: Request, res: Response) => {
        logger.info({
          class: 'Candidate',
          method: 'routes',
          action: '/api/github/matchingalgo/:login/accessToken?',
          params: {},
          value: { req, res },
        });
        let login: string = req.params.login;
        let accessToken: string = req.params.accessToken;
        let output: IGitProjectSummary;
        let githubDataExtractor: GithubDataExtraction;

        try {
          if (accessToken) {
            githubDataExtractor = new GithubDataExtraction(accessToken);
          } else {
            githubDataExtractor = new GithubDataExtraction();
          }
          output = await githubDataExtractor.matchGithubUser(login);
        } catch (e) {
          res.status(500).json({ error: e.toString() });
        }
        res.status(200).send(output);
      });
  }
}
