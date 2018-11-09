import { Request, Response } from "express";
import {BitbucketUserInfo} from "../../data-extraction/bitbucket/bitbucketUserInfo";
const logger = require('../../logger.js');
var cors = require('cors');

export class ApplicantBitbucket {

    public routes(app): void {
        //received the express instance from app.ts file
        app.route('/api/bitbucket/applicant/:username/:accessToken')
            .get(cors(), async (req: Request, res: Response) => {
                if(req.params.accessToken == undefined){
                    logger.error({
                        class: "ApplicantBitbucket",
                        method: "route",
                        action: "403 Error from bitbucket's route",
                        value: "AccessToken undefined"
                    }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                   res.status(403);
                }
                try {
                    let username: string = req.params.username;
                    let accessToken: string = req.params.accessToken;

                    let bitbucketUserInfo: BitbucketUserInfo = new BitbucketUserInfo(accessToken);

                    let data: string = await bitbucketUserInfo.getUserData(username);

                    res.status(200).send(data);
                }
                catch(error){
                    logger.error({
                        class: "ApplicantBitbucket",
                        method: "route",
                        action: "Error 500 from bitbucket's route",
                        value: error
                    }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                    res.status(500);
                }
            });
    }
}
