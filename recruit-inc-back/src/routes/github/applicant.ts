import { Request, Response } from "express";
import {Query} from "../../data-extraction/github/query";
import {GithubUserInfo} from "../../data-extraction/github/githubUserInfo";
import * as fs from 'fs';

var cors = require('cors');

let dataFile: string = "log/info.json";

export class Applicant {

    public routes(app): void {
        //received the express instance from app.ts file
        app.route('/api/github/applicant/:accessToken/:username')
            .get(cors(), async (req: Request, res: Response) => {
                let accessToken : string = req.params.accessToken;
                let username : string = req.params.username;

                let query : Query  = new Query(accessToken);

                let data: string = await query.getData(username);

                fs.writeFile(dataFile, data, (err) => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                });

                res.status(200).send(data);
            });

        app.route('/api/github/applicant/admin')
            .get(cors(), (req: Request, res: Response) => {

                fs.readFile(dataFile, (err, data) => {
                    if (err){
                        res.status(200).send(err);
                        throw err;
                    }
                    res.status(200).send(data);
                    console.log('The file was read!');
                });
            });

        app.route('/api/github/hr/:location')
            .get(cors(), async (req: Request, res: Response) => {
                let location : string = req.params.location;

                let query : GithubUserInfo   = new GithubUserInfo();

                //Grab the endCursor from the first query
                let data: string = await query.firstQuery(location);
                let jsonData = JSON.parse(data);
                let pageInfo = jsonData.data.search.pageInfo;
                let endCursor : string = JSON.stringify(pageInfo.endCursor);
                let hasNextPage : boolean = pageInfo.hasNextPage;

                
                //Use endCursor in subsequent queries to retrieve more users
                
                while (hasNextPage){
                    let nextData : string = await query.getData(location, endCursor);
                    jsonData = JSON.parse(nextData);
                    pageInfo = jsonData.data.search.pageInfo;
                    endCursor = JSON.stringify(pageInfo.endCursor);
                    hasNextPage = pageInfo.hasNextPage;
                    data+=nextData;
                }


                res.status(200).send(data);
            });
    }
}
