import { Request, Response } from "express";
import {BitbucketUserInfo} from "../../data-extraction/bitbucket/bitbucketUserInfo";

var cors = require('cors');

export class ApplicantBitbucket {

    public routes(app): void {
        //received the express instance from app.ts file
        app.route('/api/bitbucket/applicant/:username')
            .get(cors(), async (req: Request, res: Response) => {
                let username : string = req.params.username;

                let bitbucketUserInfo : BitbucketUserInfo  = new BitbucketUserInfo();

                let data: string = await bitbucketUserInfo.getData(username);

                res.status(200).send(data);
            });
    }
}
