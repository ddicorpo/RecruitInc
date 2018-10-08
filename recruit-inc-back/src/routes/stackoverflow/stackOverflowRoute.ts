import { Request, Response } from "express";
import { StackOverflowQueries } from "../../data-extraction/stackoverflow/stackOverflowQueries";
import * as fs from 'fs';
import { IProfile } from "../../data-extraction/stackoverflow/api-entities/IProfile";
import { IError } from "../../data-extraction/stackoverflow/api-entities/IError";
import { INetwork } from "../../data-extraction/stackoverflow/api-entities/INetwork";
import { IBadges } from "../../data-extraction/stackoverflow/api-entities/IBadges";
var cors = require('cors');
let pathToFakeStorage = "log/StackOverFlowFakeStorage.json"
let queryProfile : StackOverflowQueries;

export class StackOverflowRoute {
    public constructor() {
        queryProfile = new StackOverflowQueries();
    }
    public routes(app): void {
        //received the express instance from app.ts file
        app.route('/api/soverflow/applicant/profile/:userId')
            .get(cors(), async (req: Request, res: Response) => {
            this.buildStorage();
                let userId : string = req.params.userId;
                let profileData: IProfile | IError = await queryProfile.obtainProfileData(userId);
                this.appendStorage(JSON.stringify(profileData));
                res.status(200).send(profileData);
            });
        app.route('/api/soverflow/applicant/network/:userId')
            .get(cors(), async (req: Request, res: Response) => {
                this.buildStorage();
                let userId: string = req.params.userId;
                let networkData: INetwork | IError = await queryProfile.obtainNetworkData(userId);
                this.appendStorage(JSON.stringify(networkData));
                res.status(200).send(networkData);
            });
        app.route('/api/soverflow/applicant/badges/:userId')
            .get(cors(), async (req: Request, res: Response) => {
                this.buildStorage();
                let userId: string = req.params.userId;
                let badgesData: IBadges | IError = await queryProfile.obtainBadgesData(userId);
                this.appendStorage(JSON.stringify(badgesData));
                res.status(200).send(badgesData);
            });

    }

    private appendStorage(data: string): void{
        fs.appendFile(pathToFakeStorage, data, function (err) {
            if (err) throw err;
            console.log('Append Fake Storage');
        })
    }
    private buildStorage() : void {
        if(!fs.existsSync(pathToFakeStorage)){
            fs.writeFile(pathToFakeStorage, "", (err) =>{
                if(err) throw err;
            });
        }
    }
}