import { Request, Response } from "express";
import {Query} from "../../data-extraction/github/query";
import * as fs from 'fs';
import {IGithubUser} from "../../data-extraction/github/api-entities/IGithubUser";
import { GithubUserCommits } from "../../data-extraction/github/githubUserCommits";

var cors = require('cors');

let dataFile: string = "log/tempStorage.json";

export class ApplicantGithub {

    public routes(app): void {

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
            app.route('/api/github/applicant/commits/:RepoName/:OwnerUsername/:UserLogin')
            .get(cors(), async (req: Request, res: Response) => {
                

                let RepoName : string = req.params.RepoName;
                let OwnerUsername: string = req.params.OwnerUsername;
                let username: string = req.params.UserLogin;
                let githubUserCommits : GithubUserCommits  = new GithubUserCommits();
                let userID: string = await githubUserCommits.getUserID(username)

                let data = await githubUserCommits.getCommits(RepoName,OwnerUsername,userID);
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
                 dataEntry: {
                 projectInputs: [
                 {projectName: "MinistocksRework",
                  owner: "AyoubeAkaouch",
                 applicantCommits: [],
                 projectStructure: [],
                 downloadedSourceFile: []
                 },
                 {projectName: "rufus",
                  owner: "MewtR",
                 applicantCommits: [],
                 projectStructure: [],
                 downloadedSourceFile: []
                 }
                 ]
                 }
                };

                let githubUserCommits : GithubUserCommits  = new GithubUserCommits();

                await githubUserCommits.getCommitsFromUser(user);
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
                 dataEntry: {
                 projectInputs: [
                 {projectName: "MinistocksRework",
                  owner: "AyoubeAkaouch",
                 applicantCommits: [],
                 projectStructure: [],
                 downloadedSourceFile: []
                 },
                 {projectName: "rufus",
                  owner: "MewtR",
                 applicantCommits: [],
                 projectStructure: [],
                 downloadedSourceFile: []
                 }
                 ]
                 }
                };
                        let githubUserCommits : GithubUserCommits  = new GithubUserCommits();
                        //First get all commits
                        await githubUserCommits.getCommitsFromUser(user);

                        //Then get commit details
                        await githubUserCommits.getFilesAffectedByCommitFromUser(user);
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
