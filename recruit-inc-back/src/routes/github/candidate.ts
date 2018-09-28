import { Request, Response } from "express";

const cors = require('cors');

export class Candidate {

    public routes(app): void {

        app.route('/api/github/candidate/hr')
            .get(cors(), (req: Request, res: Response) => {

                //TODO Retrieve the real list of candidate found
                let data: string = '{ "Candidates" : [' +
                    '{ "firstName":"John" , "lastName":"Doe" },' +
                    '{ "firstName":"Anna" , "lastName":"Smith" },' +
                    '{ "firstName":"Peter" , "lastName":"Jones" } ]}';

                res.status(200).send(data);
            });
    }
}