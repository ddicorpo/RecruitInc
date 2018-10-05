import { Request, Response } from "express";
import {GithubUserInfo} from "../../data-extraction/github/githubUserInfo";

const cors = require('cors');

export class Candidate {

    public routes(app): void {

        app.route('/api/github/candidate/hr/:location')
            .get(cors(), async (req: Request, res: Response) => {
                let location : string = req.params.location;

                let query : GithubUserInfo   = new GithubUserInfo();

                //Grab the endCursor from the first query
                let data: string = await query.firstQuery(location);
                let jsonData = JSON.parse(data);
                let pageInfo = jsonData.data.search.pageInfo;
                let lastCreatedAt = jsonData.data.search.nodes[jsonData.data.search.nodes.length -1].createdAt;
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

                   if (!hasNextPage)
                       break;

               while (hasNextPage){

                   let nextData : string = await query.getDataBeforeWithEndCursor(location, lastCreatedAt, endCursor);
                   jsonData = JSON.parse(nextData);
                   pageInfo = jsonData.data.search.pageInfo;
                   endCursor = JSON.stringify(pageInfo.endCursor);
                   hasNextPage = pageInfo.hasNextPage;
                   data+=nextData;
               }

               }

               res.status(200).send(data);
            });
    }
}
