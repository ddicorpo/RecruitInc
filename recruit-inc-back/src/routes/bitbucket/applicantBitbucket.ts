import { Request, Response } from 'express';
import { BitbucketUserInfo } from '../../data-extraction/bitbucket/bitbucketUserInfo';
import { Logger } from '../../Logger';
var cors = require('cors');
const logger = new Logger();
export class ApplicantBitbucket {
  public routes(app): void {
    //received the express instance from app.ts file
    app
      .route('/api/bitbucket/applicant/:username/:accessToken')
      .get(cors(), async (req: Request, res: Response) => {
        if (
          req.params.accessToken == undefined ||
          req.params.accessToken === ''
        ) {
          logger.error({
            class: 'ApplicantBitbucket',
            method: 'route',
            action: "400 Error from bitbucket's route",
            params: {},
            value: { Message: 'AccessToken undefined' },
          });
          res.status(400);
        }
        if (req.params.username == undefined || req.params.username === '') {
          logger.error({
            class: 'ApplicantBitbucket',
            method: 'route',
            action: "400 Error from bitbucket's route",
            params: {},
            value: { Message: 'Username undefined' },
          });
          res.status(400);
        }
        try {
          let username: string = req.params.username;
          let accessToken: string = req.params.accessToken;

          let bitbucketUserInfo: BitbucketUserInfo = new BitbucketUserInfo(
            accessToken
          );

          let data: string = await bitbucketUserInfo.getUserData(username);

          res.status(200).send(data);
        } catch (error) {
          logger.error({
            class: 'ApplicantBitbucket',
            method: 'route',
            action: "Error 500 from bitbucket's route",
            params: {},
            value: error,
          });
          res.status(500);
        }
      });
  }
}
