import { Request, Response } from "express";
import {Query} from "../../data-extraction/github/query";

//load our local database file
export class Applicant {

    public routes(app): void {
        //received the express instance from app.ts file
        app.route('/api/github/applicant/:accessToken/:username')
            .get((req:Request, res: Response) => {
                let accessToken = req.params.accessToken;
                let username = req.params.username;

                let query = new Query(accessToken);

                let response = query.getData(username);

                res.status(200).send(response);
            })
    }
}