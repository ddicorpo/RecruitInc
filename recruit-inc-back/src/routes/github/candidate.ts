import { Request, Response } from "express";
import {GithubUserInfo} from "../../data-extraction/github/githubUserInfo";
import {GithubUserRepos} from "../../data-extraction/github/githubUserRepos";
import {GithubRepoStructure} from "../../data-extraction/github/githubRepoStructure";
import {GithubDownloadedFilesPath} from "../../data-extraction/github/githubDownloadedFilesPath";
//import { Query } from "../../data-extraction/github/query";
import {IGithubUser} from "../../data-extraction/github/api-entities/IGithubUser"

const cors = require('cors');


export class Candidate {

    public routes(app): void {

        app.route('/api/github/candidate/hr/:location')
            .get(cors(), async (req: Request, res: Response) => {
                let githubUser : IGithubUser[] ;
                
                let location : string = req.params.location;
                 
                let query : GithubUserInfo   = new GithubUserInfo();

                //Grab the endCursor from the first query
                let data: string = await query.firstQuery(location);
                let jsonData = JSON.parse(data);
                let pageInfo = jsonData.data.search.pageInfo;
                let endCursor : string = JSON.stringify(pageInfo.endCursor);
                let hasNextPage : boolean = pageInfo.hasNextPage;

                githubUser = jsonData.data.search.nodes;

                //Use endCursor in subsequent queries to retrieve more users
                while (hasNextPage){

                   let nextData : string = await query.getData(location, endCursor);
                   jsonData = JSON.parse(nextData);
                   pageInfo = jsonData.data.search.pageInfo;
                   endCursor = JSON.stringify(pageInfo.endCursor);
                   hasNextPage = pageInfo.hasNextPage;
                   data+=nextData;
                   githubUser.push(jsonData.data.search.nodes);
               }

               //Loop until a search where no users are returned
               //using the createdAt parameter to get new users
               while(1){

                   let lastCreatedAt : string = jsonData.data.search.nodes[jsonData.data.search.nodes.length -1].createdAt;
                   let nextData : string = await query.getDataBefore(location, lastCreatedAt);
                   jsonData = JSON.parse(nextData);
                   pageInfo = jsonData.data.search.pageInfo;
                   endCursor = JSON.stringify(pageInfo.endCursor);
                   hasNextPage = pageInfo.hasNextPage;
                   data+=nextData;
                   githubUser.push(jsonData.data.search.nodes);

                   if (!hasNextPage)
                       break;

               while (hasNextPage){

                   let nextData : string = await query.getDataBeforeWithEndCursor(location, lastCreatedAt, endCursor);
                   jsonData = JSON.parse(nextData);
                   pageInfo = jsonData.data.search.pageInfo;
                   endCursor = JSON.stringify(pageInfo.endCursor);
                   hasNextPage = pageInfo.hasNextPage;
                   data+=nextData;
                   githubUser.push(jsonData.data.search.nodes);
               }

               }
 
               res.status(200).send(githubUser);
            });

        app.route('/api/github/candidate/repo/:username')
            .get(cors(), async (req: Request, res: Response) => {

                
                
               let username : string = req.params.username;
               let user : IGithubUser = {login: username, url: "", createdAt: ""};
               let query : GithubUserRepos   = new GithubUserRepos();
               user = await query.getUserRepos(user);

               res.status(200).send(user.repositories);
            });

        app.route('/api/github/candidate/struct/:owner/:repoName')
            .get(cors(), async (req: Request, res: Response) => {

               let owner : string = req.params.owner;
               let repoName : string = req.params.repoName;

               let query : GithubRepoStructure = new GithubRepoStructure();
               let projectStructure = await query.getRepoStructure(owner,repoName);
               res.status(200).send(projectStructure);
            });

        app.route('/api/github/candidate/structt')
            .get(cors(), async (req: Request, res: Response) => {

                let user : IGithubUser = 
                {login: "MewtR",
                 createdAt: "",
                 url: "",
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

               let query : GithubRepoStructure = new GithubRepoStructure();
               user = await query.getRepoStructureFromUser(user);
               res.status(200).send(user);
            });

        app.route('/api/github/candidate/download/:owner/:repoName/*')
            .get(cors(), async (req: Request, res: Response) => {

               console.log(req.params);
               let owner : string = req.params.owner;
               let repoName : string = req.params.repoName;
               let query : GithubDownloadedFilesPath = new GithubDownloadedFilesPath();
               let path : string = req.params[0];
               let data = await query.downloadFile(owner,repoName,path);
               query.writeToFile(data, query.generatePath("MewtR", repoName, path));
               res.status(200).send(data);
            });
        app.route('/api/github/candidate/downloadforuser')
            .get(cors(), async (req: Request, res: Response) => {
                let user : IGithubUser = 
                {login: "MewtR",
                 createdAt: "",
                 url: "",
                 repositories: [
                 {name: "MinistocksRework",
                     owner: {
                         login: "AyoubeAkaouch"
                     }
                 },
                 {name: "SOEN343",
                     owner: {
                         login: "gprattico"
                     }
                 },
                 {name: "RecruitInc",
                     owner: {
                         login: "ddicorpo"
                     }
                 }
                 ]

                };

               //Use MewtR's access token to get data from private repo (RecruitInc)
               let githubDownloadedFilesPath : GithubDownloadedFilesPath = new GithubDownloadedFilesPath("5e6a78d61823ba36bbdff45649fde4481bb489b7");
               let githubRepoStructure : GithubRepoStructure = new GithubRepoStructure("5e6a78d61823ba36bbdff45649fde4481bb489b7");
               user = await githubRepoStructure.getRepoStructureFromUser(user);
               user = await githubDownloadedFilesPath.downloadFileForUser(user, "package.json");
               res.status(200).send(user);
            });
    }
}
