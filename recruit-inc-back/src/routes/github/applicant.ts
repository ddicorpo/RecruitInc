import { Request, Response } from "express";
import {Query} from "../../data-extraction/github/query";
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

            app.route('/api/github/applicant/')
            .get(cors(), async (req: Request, res: Response) => {
                
                let query : Query  = new Query("3bb270dc6fa9c761c2f17f225d4955d744c377d2");

                let data: string = await query.getDataHardCoded();

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
    }
}