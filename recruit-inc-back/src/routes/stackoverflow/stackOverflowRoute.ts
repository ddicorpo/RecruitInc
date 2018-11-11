import { Request, Response } from 'express';
import { StackOverflowQueries } from '../../data-extraction/stackoverflow/stackOverflowQueries';
import * as fs from 'fs';
import { IStackOverFlowProfile } from '../../data-extraction/stackoverflow/api-entities/IStackOverFlowProfile';
import { IStackOverFlowError } from '../../data-extraction/stackoverflow/api-entities/IStackOverFlowError';
import { IStackOverFlowNetwork } from '../../data-extraction/stackoverflow/api-entities/IStackOverFlowNetwork';
import { IStackOverFlowBadges } from '../../data-extraction/stackoverflow/api-entities/IStackOverFlowBadges';
var cors = require('cors');
let pathToFakeStorage = 'log/StackOverFlowFakeStorage.json';
let queryProfile: StackOverflowQueries;

export class StackOverflowRoute {
  public constructor() {
    queryProfile = new StackOverflowQueries();
  }
  public routes(app): void {
    //received the express instance from app.ts file
    app
      .route('/api/soverflow/applicant/profile/:userId')
      .get(cors(), async (req: Request, res: Response) => {
        this.buildStorage();
        let userId: string = req.params.userId;
        let profileData:
          | IStackOverFlowProfile
          | IStackOverFlowError = await queryProfile.obtainProfileData(userId);
        this.appendStorage(JSON.stringify(profileData));
        res.status(200).send(profileData);
      });
    app
      .route('/api/soverflow/applicant/network/:userId')
      .get(cors(), async (req: Request, res: Response) => {
        this.buildStorage();
        let userId: string = req.params.userId;
        let networkData:
          | IStackOverFlowNetwork
          | IStackOverFlowError = await queryProfile.obtainNetworkData(userId);
        this.appendStorage(JSON.stringify(networkData));
        res.status(200).send(networkData);
      });
    app
      .route('/api/soverflow/applicant/badges/:userId')
      .get(cors(), async (req: Request, res: Response) => {
        this.buildStorage();
        let userId: string = req.params.userId;
        let badgesData:
          | IStackOverFlowBadges
          | IStackOverFlowError = await queryProfile.obtainBadgesData(userId);
        this.appendStorage(JSON.stringify(badgesData));
        res.status(200).send(badgesData);
      });
  }

  private appendStorage(data: string): void {
    fs.appendFile(pathToFakeStorage, data, function(err) {
      if (err) throw err;
      console.log('Append Fake Storage');
    });
  }
  private buildStorage(): void {
    if (!fs.existsSync(pathToFakeStorage)) {
      fs.writeFile(pathToFakeStorage, '', err => {
        if (err) throw err;
      });
    }
  }
}
