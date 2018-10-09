import { Request, Response } from "express";
import {Query} from "../../data-extraction/github/query";
import * as fs from 'fs';
import {IGithubUser} from "../../data-extraction/github/api-entities/IGithubUser";

var cors = require('cors');

let dataFile: string = "log/tempStorage.json";

export class ApplicantGithub {

    public routes(app): void {
        //received the express instance from app.ts file
        app.route('/api/github/applicant/:username')
            .get(cors(), async (req: Request, res: Response) => {
                this.buildFakeStorage();

                let githubUser : IGithubUser ;
                let username : string = req.params.username;

                let query : Query  = new Query();

                let data: string = await query.getData(username);
                let jsonData = JSON.parse(data)
                githubUser = jsonData.data.user;
                githubUser.repositories = jsonData.data.user.repositories.nodes;
            
                fs.writeFile(dataFile, data, (err) => {
            
                    if (err) throw err;
                    console.log('The file has been changed!');
                    
                });

             
                res.status(200).send(githubUser);
                //for testing purposes
                //console.log(githubUser.repositories[1].languages);
            });

        app.route('/api/github/applicant/admin')
            .get(cors(), (req: Request, res: Response) => {
                this.buildFakeStorage();
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

    private buildFakeStorage() : void{
        if(!fs.existsSync(dataFile)){
            fs.writeFile(dataFile, "", (err) => {
                if (err) throw err;
                console.log('The file has been created!');
            });
        }
    }
}
