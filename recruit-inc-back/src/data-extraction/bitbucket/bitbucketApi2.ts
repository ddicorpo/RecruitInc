import fetch from "node-fetch";
import bodyParser from "./bodyParser";
const logger = require('../../logger.js');
const fs = require('fs');

export class BitbucketApi2 {

    public queryUserInfo(accessToken: string, user: string ) : string{
        logger.info({class: "bitbucketApi2", method: "queryData", action: "Querying bitbucket's api", params: {accessToken, user}}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
        return fetch(`https://api.bitbucket.org/2.0/users/${user}/repositories`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        }).then(response => response.text())
            .then(body => {
                logger.info({class: "bitbucketApi2", method: "queryData", action: "Result from bitbucket's api", value: body}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                console.log("This is the body: ", body);

                let myBodyParser = new bodyParser();
                var repoName = myBodyParser.getRepoName(body);

                fs.writeFile('bitbucketRepoList.json', body, function(err){
                    if (err) {
                       throw err;;
                   }
                });
                return body;
            })
            .catch(error => {
                logger.error({class: "bitbucketApi2", method: "queryData", action: "Error from bitbucket's api", value: error}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                return error;
            });
    }
}
