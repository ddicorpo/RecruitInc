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





            

            //Get all user commits on a given repo
            app.route('/api/github/applicant/commits/:RepoName/:OwnerUsername/:UserEmail')
            .get(cors(), async (req: Request, res: Response) => {
                

                let RepoName : string = req.params.RepoName;
                let OwnerUsername: string = req.params.OwnerUsername;
                let UserEmail: string = req.params.UserEmail;
                let username: string = req.params.username;
                let query6 : GithubUserCommits  = new GithubUserCommits();

                let data = await query6.getCommits(RepoName,OwnerUsername,UserEmail);
                //let jsonData = JSON.parse(data)

                res.status(200).send(data);
            });

            //Update an IGithubUser with their commits for all repos
            app.route('/api/github/applicant/commits/updateuser')
            .get(cors(), async (req: Request, res: Response) => {
                
                let user : IGithubUser = 
                {login: "MewtR",
                 createdAt: "",
                 url: "",
                 email: "mohamedlemineelhadj@outlook.com",
                 repositories: [
                 {name: "MinistocksRework",
                     owner: {
                         login: "AyoubeAkaouch"
                     }
                 },
                 {name: "rufus",
                     owner: {
                         login: "MewtR"
                     }
                 },
                 {name: "SOEN343",
                     owner: {
                         login: "gprattico"
                     }
                 },
                 {name: "agenda",
                     owner: {
                         login: "Philippe229"
                     }
                 },
                 {name: "simple-maven-project-with-tests",
                     owner: {
                         login: "MewtR"
                     }
                 },
                 {name: "express-app-testing-demo",
                     owner: {
                         login: "MewtR"
                     }
                 }
                 ]

                };

                let query6 : GithubUserCommits  = new GithubUserCommits();

                await query6.getCommitsFromUser(user);
                //let jsonData = JSON.parse(data)

                res.status(200).send(user);
                
            });


           
                //Get a list of files affected by a given commit
                app.route('/api/github/applicant/repos/:owner/:repo/commits/:sha')
                    .get(cors(), async (req: Request, res: Response) => {
                        let owner : string = req.params.owner;
                        let repo : string = req.params.repo;
                        let sha : string = req.params.sha;
                        //let accessToken : string = req.params.accessToken;
                        let query7 : GithubUserCommits  = new GithubUserCommits();
                        let datas = await query7.getFilesAffectedByCommit(owner,repo, sha);
                        //let jsonData = JSON.parse(datas);
        
                        res.status(200).send(datas);
                    });
        
                //Update a user to get the details of his commits
                app.route('/api/github/applicant/detailedcommits/updateuser')
                    .get(cors(), async (req: Request, res: Response) => {
                let user : IGithubUser = 
                {login: "MewtR",
                 createdAt: "",
                 url: "",
                 email: "mohamedlemineelhadj@outlook.com",
                 repositories: [
                 {name: "MinistocksRework",
                     owner: {
                         login: "AyoubeAkaouch"
                     }
                 },
                 {name: "rufus",
                     owner: {
                         login: "MewtR"
                     }
                 },
                 {name: "SOEN343",
                     owner: {
                         login: "gprattico"
                     }
                 },
                 {name: "agenda",
                     owner: {
                         login: "Philippe229"
                     }
                 },
                 {name: "simple-maven-project-with-tests",
                     owner: {
                         login: "MewtR"
                     }
                 },
                 {name: "express-app-testing-demo",
                     owner: {
                         login: "MewtR"
                     }
                 }
                 ]

                };
                        let query7 : GithubUserCommits  = new GithubUserCommits();
                        //First get all commits
                        await query7.getCommitsFromUser(user);

                        //Then get commit details
                        await query7.getFilesAffectedByCommitFromUser(user);
                        //let jsonData = JSON.parse(datas);
        
                        res.status(200).send(user);
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
