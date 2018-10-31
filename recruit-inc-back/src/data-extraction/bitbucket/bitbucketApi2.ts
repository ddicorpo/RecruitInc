import fetch from "node-fetch";
import bodyParser from "./bodyParser";
import { IGitProjectInput } from "../../matching-algo/data-model/input-model/IGitProjectInput";
import { IProjectStructure } from "../../matching-algo/data-model/input-model/IProjectStructure";
import { ICommit } from "../../matching-algo/data-model/input-model/ICommit";
import { ISingleFileCommit } from "../../matching-algo/data-model/input-model/ISingleFileCommit";
import {ISourceFiles} from "../../matching-algo/data-model/input-model/ISourceFiles";
const logger = require('../../logger.js');
const fs = require('fs');

export class BitbucketApi2 {

    public queryUserInfo(accessToken: string, user: string): IGitProjectInput[] {
        logger.info({
            class: "bitbucketApi2",
            method: "queryData",
            action: "Querying bitbucket's api",
            params: {accessToken, user}
        }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
        return fetch(`https://api.bitbucket.org/2.0/users/${user}/repositories`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        }).then(response => response.json())
            .then(body => {
                logger.info({
                    class: "bitbucketApi2",
                    method: "queryData",
                    action: "Result from bitbucket's api for repo slug",
                    value: body
                }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

                let iterator = 0;

                let allGitProjectInput: IGitProjectInput[];

                while (iterator < body.values.length) {
                    fs.writeFile('bitbucketRepoList.json', body.values[iterator].slug, function (err) {
                        if (err) {
                            throw err;
                            ;
                        }
                    });

                    let gitProjectInput: IGitProjectInput = {
                        projectName: body.values[iterator].slug,
                        applicantCommits: this.queryCommitInfo(accessToken, user, body.values[iterator].slug),
                        projectStructure: this.queryProjectStructInfo(accessToken, user, body.values[iterator].slug),
                        downloadedSourceFile: this.querySourceFileInfo(accessToken, user, body.values[iterator].slug)
                    };

                    allGitProjectInput.push(gitProjectInput);

                    iterator += 1;
                }

                return allGitProjectInput;
            })
            .catch(error => {
                logger.error({
                    class: "bitbucketApi2",
                    method: "queryData",
                    action: "Error from bitbucket's api: USER INFO",
                    value: error
                }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                return error;
            });
    }

    public queryCommitInfo(accessToken: string, user: string, repoName: string): ICommit[] {
        logger.info({
            class: "bitbucketApi2",
            method: "queryData ",
            action: "Querying bitbucket's api for hash",
            params: {accessToken, user: user}
        }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

        return fetch(`https://api.bitbucket.org/2.0/repositories/${user}/${repoName}/commits`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        }).then(response => response.json())
            .then(body => {
                logger.info({
                    class: "bitbucketApi2",
                    method: "queryData",
                    action: "Result from bitbucket's api",
                    value: body
                }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

                let iterator = 0;
                let allCommits: ICommit[];

                while (iterator < body.values.length) {

                    if (body.values[iterator].author.user != undefined) {
                        if (JSON.stringify(body.values[iterator].author.user.username).match(user)) {
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
                logger.error({
                    class: "bitbucketApi2",
                    method: "queryData",
                    action: "Error from bitbucket's api: COMMIT INFO",
                    value: error
                }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                return error;
            });
    }

    public queryDiffStats(accessToken: string, user: string, repoName: string, hash: string): ISingleFileCommit[] {
        logger.info({
            class: "bitbucketApi2",
            method: "queryData ",
            action: "Querying bitbucket's api for diffstats",
            params: {accessToken, user: user}
        }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

        return fetch(`https://api.bitbucket.org/2.0/repositories/${user}/${repoName}/diffstat/${hash}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        }).then(response => response.json())
            .then(body => {
                logger.info({
                    class: "bitbucketApi2",
                    method: "queryData",
                    action: "Result from bitbucket's api",
                    value: body
                }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

                let singleCommitIndex: number = 0;
                let allSingleCommits: ISingleFileCommit[];

                while (singleCommitIndex < body.values.length) {

                    let singleFileCommit: ISingleFileCommit = {
                        filePath: body.values[singleCommitIndex].new.links.self.href,
                        lineAdded: body.values[singleCommitIndex].lines_added,
                        lineDeleted: body.values[singleCommitIndex].lines_removed
                    };
                    allSingleCommits.push(singleFileCommit);

                    singleCommitIndex++;
                }

                return allSingleCommits;

            }).catch(error => {
                logger.error({
                    class: "bitbucketApi2",
                    method: "queryData",
                    action: "Error from bitbucket's api: DIFF STATS",
                    value: error
                }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                return error;
            });
    }

    public querySourceFileInfo(accessToken: string, user: string, repoName: string): ISourceFiles[] {
        logger.info({
            class: "bitbucketApi2",
            method: "queryData",
            action: "Querying bitbucket's api",
            params: {accessToken, user}
        }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
        return fetch(`https://api.bitbucket.org/2.0/repositories/${user}/${repoName}/src`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        }).then(response => response.json())
            .then(body => {
                logger.info({
                    class: "bitbucketApi2",
                    method: "queryData",
                    action: "Result from bitbucket's api for repo slug",
                    value: body
                }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

                let fileIterator: number = 0;

                let allSourceFiles: ISourceFiles[];

                while (fileIterator < body.values.length) {
                    if (body.values[fileIterator].path = ".gitignore") {
                        let sourceFile: ISourceFiles = {
                            filename: body.values[fileIterator].path,
                            repoFilePath: body.values[fileIterator].links.self.href,
                            // TODO: Figure out how to download the raw file
                            localFilePath: "https://bitbucket.org/" + user + "/" + repoName + "/get/master.zip"
                        };

                        allSourceFiles.push(sourceFile);
                        break;
                    }
                    fileIterator++;
                }

                return allSourceFiles;
            })
            .catch(error => {
                logger.error({
                    class: "bitbucketApi2",
                    method: "queryData",
                    action: "Error from bitbucket's api: SOURCE FILE INFO",
                    value: error
                }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                return error;
            });
    }

    public queryProjectStructInfo(accessToken: string, user: string, repoName: string): IProjectStructure[] {
        logger.info({
            class: "bitbucketApi2",
            method: "queryData",
            action: "Querying bitbucket's api",
            params: {accessToken, user}
        }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
        return fetch(`https://api.bitbucket.org/2.0/repositories/${user}/${repoName}/src`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        }).then(response => response.json())
            .then(body => {
                logger.info({
                    class: "bitbucketApi2",
                    method: "queryData",
                    action: "Result from bitbucket's api for repo slug",
                    value: body
                }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

                let fileIterator: number = 0;
                let innerIterator: number = 0;
                let allProjectStruct: IProjectStructure[];

                while (fileIterator < body.values.length){
                    if (body.values[fileIterator].type == "commit_directory"){
                        let tempProjectStructure: IProjectStructure[] = this.queryDirectoryInfo(accessToken, user, repoName, body.values[0].commit.hash, body.values[fileIterator].path);

                        for (let value of tempProjectStructure){
                            allProjectStruct.push(value);
                        }
                        // while (innerIterator < tempProjectStructure.length){
                        //     allProjectStruct.push(tempProjectStructure[innerIterator]);
                        //     innerIterator++;
                        // }
                        // innerIterator = 0;
                        tempProjectStructure = null;
                    }

                    if (body.values[fileIterator].type == "commit_file"){
                        let projStruct: IProjectStructure = {
                            fileId: body.values[0].commit.hash,
                            filePath: body.values[fileIterator].links.self.href,
                            fileName: body.values[fileIterator].path
                        }

                        allProjectStruct.push(projStruct);
                    }
                }

                return allProjectStruct;
            })
            .catch(error => {
                logger.error({
                    class: "bitbucketApi2",
                    method: "queryData",
                    action: "Error from bitbucket's api: PROJECT STRUCT INFO",
                    value: error
                }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                return error;
            });
    }

    public queryDirectoryInfo(accessToken: string, user: string, repoName: string, hash: string, path: string): IProjectStructure[] {
        logger.info({
            class: "bitbucketApi2",
            method: "queryData",
            action: "Querying bitbucket's api",
            params: {accessToken, user}
        }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
        return fetch(`https://api.bitbucket.org/2.0/repositories/${user}/${repoName}/src/${hash}/${path}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        }).then(response => response.json())
            .then(body => {
                logger.info({
                    class: "bitbucketApi2",
                    method: "queryData",
                    action: "Result from bitbucket's api for repo slug",
                    value: body
                }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

                // console.log("\n\n\nTHIS IS BODY FOR FILE: " + body.values[7].path + "\n\n\n");
                console.log("\n\n\nTHIS IS DIRECTORY FOR FILE: " + body + "\n\n\n");
                console.log(body);

                //console.log("\n\n\nTHIS IS COMMIT HASH: " + body.values[0].commit.hash + "\n\n\n")

                let fileIterator: number = 0;
                let innerIterator: number = 0;

                let allProjectStruct: IProjectStructure[];

                while (fileIterator < body.values.length){
                    if (body.values[fileIterator].type == "commit_directory"){
                        let tempProjectStructure: IProjectStructure[] = this.queryDirectoryInfo(accessToken, user, repoName, hash, body.values[fileIterator].path);


                        for (let value of tempProjectStructure){
                            allProjectStruct.push(value);
                        }
                        // while (innerIterator < tempProjectStructure.length){
                        //     allProjectStruct.push(tempProjectStructure[innerIterator]);
                        //     innerIterator++;
                        // }
                        // innerIterator = 0;
                        tempProjectStructure = null;
                    }

                    if (body.values[fileIterator].type == "commit_file"){
                        let projStruct: IProjectStructure = {
                            fileId: hash,
                            filePath: body.values[fileIterator].links.self.href,
                            fileName: body.values[fileIterator].path
                        }

                        allProjectStruct.push(projStruct);
                    }
                }

                return allProjectStruct;
            })
            .catch(error => {
                logger.error({
                    class: "bitbucketApi2",
                    method: "queryData",
                    action: "Error from bitbucket's api: DIRECTORY INFO",
                    value: error
                }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                return error;
            });
    }
}