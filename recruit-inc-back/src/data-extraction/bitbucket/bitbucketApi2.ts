import fetch from "node-fetch";
import bodyParser from "./bodyParser";
import { ICommit } from "../../matching-algo/data-model/input-model/ICommit";
import { ISingleFileCommit } from "../../matching-algo/data-model/input-model/ISingleFileCommit";
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
                logger.info({class: "bitbucketApi2", method: "queryData", action: "Result from bitbucket's api for repo slug", value: body}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

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

    public queryCommitInfo(accessToken: string, user: string, repoName: string) : ICommit[]{
        logger.info({class: "bitbucketApi2", method: "queryData ", action: "Querying bitbucket's api for hash", params: {accessToken, user: user}}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

        return fetch(`https://api.bitbucket.org/2.0/repositories/${user}/${repoName}/commits`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        }).then(response => response.json())
            .then(body => {
                logger.info({class: "bitbucketApi2", method: "queryData", action: "Result from bitbucket's api", value: body}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

                //console.log("commits body: " + body);

                let iterator = 0;
                let allCommits: ICommit[];

                 while (iterator < body.values.length){

                     if(body.values[iterator].author.user != undefined){
                         if (JSON.stringify(body.values[iterator].author.user.username).match(user)){
                             //console.log("\n\n\n\n" + body.values[iterator].hash + "\n\n\n\n\n");
                             let allSingleCommits = this.queryDiffStats(accessToken, user, repoName, body.values[iterator].hash);
                             let commit: ICommit = {
                                 id: body.values[iterator].hash,
                                 numberOfFileAffected: allSingleCommits.length,
                                 files: allSingleCommits
                             };
                             allCommits.push(commit);
                         }
                     }
                     iterator += 1;
                }
                return allCommits;

            }).catch(error => {
                logger.error({class: "bitbucketApi2", method: "queryData", action: "Error from bitbucket's api", value: error}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                return error;
            });
    }

    public queryDiffStats(accessToken: string, user: string, repoName: string, hash: string) : ISingleFileCommit[]{
        logger.info({class: "bitbucketApi2", method: "queryData ", action: "Querying bitbucket's api for diffstats", params: {accessToken, user: user}}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

        return fetch(`https://api.bitbucket.org/2.0/repositories/${user}/${repoName}/diffstat/${hash}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        }).then(response => response.json())
            .then(body => {
                logger.info({class: "bitbucketApi2", method: "queryData", action: "Result from bitbucket's api", value: body}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                console.log("\n\n\n launched the diffstats query \n\n\n")
                // console.log(body);
                // console.log("\n\n\nThis is the new object size: " + body.values.length + "\n\n\n");
                // console.log("\n\n\nThis is the new object href: " + body.values[0].new.links.self.href + "\n\n\n");
                // console.log("\n\n\nThis is the new object lines added: " + body.values[0].lines_added + "\n\n\n");
                // console.log("\n\n\nThis is the new object lines removed: " + body.values[0].lines_removed + "\n\n\n");

                let singleCommitIndex: number = 0;
                let allSingleCommits: ISingleFileCommit[];

                while (singleCommitIndex < body.values.length){

                    let singleFileCommit: ISingleFileCommit = {
                        filePath: body.values[singleCommitIndex].new.links.self.href,
                        lineAdded: body.values[singleCommitIndex].lines_added,
                        lineDeleted: body.values[singleCommitIndex].lines_removed
                    };
                    allSingleCommits.push(singleFileCommit);

                    singleCommitIndex++;
                }

                // singleFileCommit.filePath = body.values[0].new.links.self.href;
                return allSingleCommits;

            }).catch(error => {
                logger.error({class: "bitbucketApi2", method: "queryData", action: "Error from bitbucket's api", value: error}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                return error;
            });
    }
}
