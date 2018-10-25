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
        }).then(response => response.json())
            .then(body => {
                logger.info({class: "bitbucketApi2", method: "queryData", action: "Result from bitbucket's api", value: body}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

                let iterator = 0;

                while (iterator < body.values.length){
                    fs.writeFile('bitbucketRepoList.json', body.values[iterator].slug, function (err) {
                        if (err) {
                            throw err;
                            ;
                        }
                    });

                    this.queryCommitInfo(accessToken, user, body.values[iterator].slug);

                    iterator += 1;
                }

                return body;
            })
            .catch(error => {
                logger.error({class: "bitbucketApi2", method: "queryData", action: "Error from bitbucket's api", value: error}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                return error;
            });
    }

    public queryCommitInfo(accessToken: string, user: string, repoName: string) : string{
        logger.info({class: "bitbucketApi2", method: "queryData", action: "Querying bitbucket's api", params: {accessToken, user: user}}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

        return fetch(`https://api.bitbucket.org/2.0/repositories/${user}/${repoName}/commits`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        }).then(response => response.json())
            .then(body => {
                logger.info({class: "bitbucketApi2", method: "queryData", action: "Result from bitbucket's api", value: body}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

                console.log("commits body: " + body);
                console.log("repo name: " + repoName);
                console.log("user name: " + user);

                console.log("\n\n" + body.values[0].author.user.username + "\n\n");

                console.log("\n\n" + JSON.stringify(body.values) + "\n\n");

                let iterator: number = 0;

                // for (let values of body.values){
                //     console.log("\n\n" + values.author.user.username + "\n\n");
                //
                //     if (JSON.stringify(body.values[iterator].author.user.username).match(user)){
                //             console.log("\n\n\n\n" + body.values[iterator].hash + "\n\n\n\n\n");
                //         }
                // }

                // while (iterator <= 30){
                //     console.log("\n\n" + body.values[iterator].author.user.username + "\n\n");
                //
                //     if (JSON.stringify(body.values[iterator].author.user.username).match(user)){
                //         console.log("OK");
                //     }
                //     // if (JSON.stringify(body.values[iterator].author.user.username).match(loggedUser)){
                //     //     console.log("\n\n\n\n" + body.values[iterator].hash + "\n\n\n\n\n");
                //     // }
                //
                //     console.log("body value length: " + body.values.length);
                //     iterator++;
                // }

                return body;

            }).catch(error => {
                logger.error({class: "bitbucketApi2", method: "queryData", action: "Error from bitbucket's api", value: error}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                return error;
            });
    }
}
