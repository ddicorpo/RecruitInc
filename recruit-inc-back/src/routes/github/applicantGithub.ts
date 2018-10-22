import { Request, Response } from "express";
import {Query} from "../../data-extraction/github/query";
import * as fs from 'fs';
import {IGithubUser} from "../../data-extraction/github/api-entities/IGithubUser";
import { GithubUserCommits } from "../../data-extraction/github/githubUserCommits";

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





            

            app.route('/api/github/applicant/commits/:RepoName/:OwnerUsername/:UserEmail')
            .get(cors(), async (req: Request, res: Response) => {
                

                let githubUser : IGithubUser ;
                let RepoName : string = req.params.RepoName;
                //console.log(RepoName);
                let OwnerUsername: string = req.params.OwnerUsername;
                let UserEmail: string = req.params.UserEmail;
                let username: string = req.params.username;
                let query6 : GithubUserCommits  = new GithubUserCommits();

                let data = await query6.gwt(RepoName,OwnerUsername,UserEmail);
                let jsonData = JSON.parse(data)
               //let detail = jsonData.data.repositories;
                //let output =JSON.stringify(jsonData);
               
            

             //console.log(jsonData.data);
                res.status(200).send(jsonData.data);
                
            });


           
                app.route('/api/github/applicant/repos/:owner/:repo/commits/:sha')
                    .get(cors(), async (req: Request, res: Response) => {
                        let owner : string = req.params.owner;
                        let repo : string = req.params.repo;
                        let sha : string = req.params.sha;
                        //let accessToken : string = req.params.accessToken;
        
                        let query7 : GithubUserCommits  = new GithubUserCommits();
        
                        let datas: string = await query7.getUserCommits(owner,repo, sha);
        
                        res.status(200).send(datas);
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
