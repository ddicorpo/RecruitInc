import { Request, Response } from "express";
import {GithubUserInfo} from "../../data-extraction/github/githubUserInfo";
import {GithubUserRepos} from "../../data-extraction/github/githubUserRepos";
import {GithubRepoStructure} from "../../data-extraction/github/githubRepoStructure";
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

               console.log(user);
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
    }
}
