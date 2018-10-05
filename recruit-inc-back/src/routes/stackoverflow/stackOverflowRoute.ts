import { Request, Response } from "express";
import { StackOverflowQueries } from "../../data-extraction/stackoverflow/stackOverflowQueries";
import * as fs from 'fs';
var cors = require('cors');

let dataFile: string = "log/info.json";
let queryProfile : StackOverflowQueries;

export class StackOverflowRoute {
    public constructor() {
        queryProfile = new StackOverflowQueries();
    }
    public routes(app): void {
        //received the express instance from app.ts file
        app.route('/api/soverflow/applicant/profile/:userId')
            .get(cors(), async (req: Request, res: Response) => {
                let userId : string = req.params.userId;
                let profileData: string = await queryProfile.obtainProfileData(userId);

                res.status(200).send(profileData);
            });
        app.route('/api/soverflow/applicant/network/:userId')
            .get(cors(), (req: Request, res: Response) => {
                    res.status(200).send("network");
            });
        app.route('/api/soverflow/applicant/badges/:userId')
            .get(cors(), (req: Request, res: Response) => {
                    res.status(200).send("user");
            });
    }
}