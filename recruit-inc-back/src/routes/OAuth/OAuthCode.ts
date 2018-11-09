import { Request, Response } from 'express';
import { GithubToken } from '../../data-extraction/github/GithubToken';
import { BitbucketToken } from '../../data-extraction/bitbucket/BitbucketToken';
//import {GitlabToken} from "../../data-extraction/gitlab/GitlabToken";
import * as fs from 'fs';

const logger = require('../../logger.js');
let cors = require('cors');
let userFileName: string = 'src/routes/OAuth/users.json';

export class OAuthCode {
  public routes(app): void {
    app
      .route('/api/oauth/oauthcode/:platform/:code/:username')
      .get(cors(), async (request: Request, response: Response) => {
        logger.info(
          {
            class: 'OAuthCode',
            method: 'routes',
            action: '/api/OAuth/OAuthCode/:code',
            value: { request, response },
          },
          { timestamp: new Date().toLocaleTimeString(), processID: process.pid }
        );

        let code = request.params.code;
        let platform = request.params.platform;
        let username = request.params.username;

        console.log('USERNAME: ' + username);

        let returnResponse: string;
        let token: string;

        let returnCode: number = 200;
        switch (platform) {
          case 'github': {
            token = await new GithubToken().getToken(code);
            token = JSON.parse(token).access_token;
            returnResponse =
              'Access Token received from Github using code: ' +
              code +
              ' -> token: ' +
              token;
            break;
          }
          case 'gitlab': {
            //when gitlab is being used the code is the token right now
            //token = await new GitlabToken().getToken(code);
            token = code;
            returnResponse =
              'Access Token received from Gitlab: -> token: ' + token;
            break;
          }
          case 'bitbucket': {
            token = await new BitbucketToken().getToken(code);
            token = JSON.parse(token).access_token;
            returnResponse =
              'Access Token received from BitBucket using code: ' +
              code +
              ' -> token: ' +
              token;
            break;
          }
          default: {
            returnResponse =
              'Invalid platform, no access Token received using code: ' + code;
            returnCode = 400;
            break;
          }
        }

        //Future write to Database here
        if (returnCode != 400) {
          let user = {
            user: {
              username: username,
              accessToken: token,
            },
          };

          fs.writeFile(userFileName, JSON.stringify(user, null, 2), error => {
            if (error) {
              logger.info(
                {
                  class: 'OAuthCode',
                  method:
                    'route /api/oauth/oauthcode/:platform/:code/:username',
                  action: 'ERROR writing access token to user file',
                  value: error,
                },
                {
                  timestamp: new Date().toLocaleTimeString(),
                  processID: process.pid,
                }
              );
              returnCode = 400;
            } else {
              logger.info(
                {
                  class: 'OAuthCode',
                  method:
                    'route /api/oauth/oauthcode/:platform/:code/:username',
                  action: 'Writing the access token to user file',
                  value: 'SUCCESS file changed: added token: ' + token,
                },
                {
                  timestamp: new Date().toLocaleTimeString(),
                  processID: process.pid,
                }
              );
            }
          });
        }

        response.status(returnCode).send(returnResponse);
      });
  }
}
