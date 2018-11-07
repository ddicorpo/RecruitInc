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

                let iterator:number  = 0;

                let allGitProjectInput: IGitProjectInput[];

                while (iterator < body.values.length) {
                    fs.writeFile('bitbucketRepoList.json', body.values[iterator].slug, function (err) {
                        if (err) {
                            throw err;
                            ;
                        }
                    });

                    this.queryProjectStructInfo(accessToken, user, body.values[iterator].slug)
                    // let testDownload = this.queryDownloadFiles(accessToken, user, body.values[iterator].slug);
                    // console.log(testDownload);

                    let gitProjectInput: IGitProjectInput = {
                        projectName: body.values[iterator].slug,
                        applicantCommits: this.queryCommitInfo(accessToken, user, body.values[iterator].slug),
                        projectStructure: this.queryProjectStructInfo(accessToken, user, body.values[iterator].slug),
                        downloadedSourceFile: this.querySourceFileInfo(accessToken, user, body.values[iterator].slug)
                    };

                    //allGitProjectInput.push(gitProjectInput);

                    iterator++;
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
                let bsCounter:number = 0;
                console.log("\n\n\n this is the bsCounter " + bsCounter);
                while (fileIterator < body.values.length){
                    console.log("\n\n\n file type" + body.values[fileIterator].type);
                    console.log("\n\n\n boolean " + body.values[fileIterator].type.match("commit_directory"));

                    if (body.values[fileIterator].type === ("commit_directory")){
                        console.log("\n\n\n I have gone deeper ");
                        let tempProjectStructure: IProjectStructure[] = this.queryDirectoryInfo(accessToken, user, repoName, hash, body.values[fileIterator].path);

                        for (let value of tempProjectStructure){
                            bsCounter++;
                            console.log("\n\n\n this is the bsCounter " + bsCounter);
                            allProjectStruct.push(value);
                        }
                        // while (innerIterator < tempProjectStructure.length){
                        //     allProjectStruct.push(tempProjectStructure[innerIterator]);
                        //     innerIterator++;
                        // }
                        // innerIterator = 0;
                        tempProjectStructure = null;
                    }
                    //TODO: FIX THIS, PROBLEM LIKELY IN THE IF BELOW
                    if (body.values[fileIterator].type === ("commit_file")){

                        let projStruct: IProjectStructure = {
                            fileId: hash,
                            filePath: body.values[fileIterator].links.self.href,
                            fileName: body.values[fileIterator].path
                        }

                        allProjectStruct.push(projStruct);
                    }
                    console.log("\n\n\n this is the fileIterator " + fileIterator);
                    fileIterator++;
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

    public queryDownloadFiles(accessToken: string, user: string, repoName: string): string {
        logger.info({
            class: "bitbucketApi2",
            method: "queryData",
            action: "Querying bitbucket's api to download files",
            params: {accessToken, user}
        }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
        return fetch(`https://bitbucket.org/${user}/${repoName}/raw/HEAD/.gitignore`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        }).then(response => response.text())
            .then(body => {
                logger.info({
                    class: "bitbucketApi2",
                    method: "queryData",
                    action: "Result from bitbucket's api for repo slug",
                    value: body
                }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

                return body;
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

    // public async queryUserInfo(accessToken: string, user: string): Promise<any> {
    //     logger.info({
    //         class: "bitbucketApi2",
    //         method: "queryData",
    //         action: "Querying bitbucket's api",
    //         params: {accessToken, user}
    //     }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
    //     try {
    //         const res: Response = await fetch(`https://api.bitbucket.org/2.0/users/${user}/repositories`, {
    //             method: 'GET',
    //             headers: {
    //                 'Authorization': accessToken
    //             }
    //         });
    //         const data = await res.json();
    //
    //         // loop through data.values
    //         const projectInput = await Promise.all(data.map(async (item, index, array) => {
    //             // write what you need to your file
    //
    //             try {
    //                 console.log("THIS IS ARRAY: " + array);
    //                 return {
    //                     projectName: await data.values[index].slug,
    //                     applicantCommits: await this.queryCommitInfo(accessToken, user, data.values[index].slug),
    //                     projectStructure: await this.queryProjectStructInfo(accessToken, user, data.values[index].slug),
    //                     downloadedSourceFile: await this.querySourceFileInfo(accessToken, user, data.values[index].slug)
    //                     // projectInput will hold an array of objects structured like above
    //                 };
    //
    //             } catch (error) {
    //                 logger.error({
    //                     class: "bitbucketApi2",
    //                     method: "queryData",
    //                     action: "Error from bitbucket's api: USER INFO",
    //                     value: error
    //                 }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
    //             }
    //         }));
    //
    //         return projectInput;
    //     } catch (error) {
    //         logger.error({
    //             class: "bitbucketApi2",
    //             method: "queryData",
    //             action: "Error from bitbucket's api: USER INFO",
    //             value: error
    //         }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
    //     }
    //
    // }
}