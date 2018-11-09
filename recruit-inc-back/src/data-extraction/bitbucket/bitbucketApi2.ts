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

    public async queryUserInfo(accessToken: string, user: string): Promise <any> {
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
            .then(async body => {
                logger.info({
                    class: "bitbucketApi2",
                    method: "queryData",
                    action: "Result from bitbucket's api for repo slug",
                    value: body
                }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

                let iterator:number  = 0;

                let allGitProjectInput: Array<any> = new Array<any>();;

                while (iterator < body.values.length) {
                    fs.writeFile('bitbucketRepoList.json', body.values[iterator].slug, function (err) {
                        if (err) {
                            throw err;
                            ;
                        }
                    });

                    //this.queryProjectStructInfo(accessToken, user, body.values[iterator].slug)
                    let gitProjectInput: IGitProjectInput = new class implements IGitProjectInput {
                        applicantCommits: ICommit[];
                        downloadedSourceFile: ISourceFiles[] = [];
                        projectName: string;
                        projectStructure: IProjectStructure[];
                    }


                    // gitProjectInput.projectName = body.values[iterator].slug;
                    // gitProjectInput.applicantCommits = await this.queryCommitInfo(accessToken, user, body.values[iterator].slug);
                    gitProjectInput.projectStructure = await this.queryProjectStructInfo(accessToken, user, body.values[iterator].slug);

                    for(let i = 0; i < gitProjectInput.projectStructure.length; i++){

                        if(gitProjectInput.projectStructure[i].fileName == ".gitignore" || gitProjectInput.projectStructure[i].fileName == "ConsistencyChecker.java") {
                            let sourceFile: ISourceFiles =  new class implements ISourceFiles {
                                filename: string;
                                localFilePath: string;
                                repoFilePath: string;
                            }
                            // let tempPath = gitProjectInput.projectStructure[i].filePath;
                            // let split = tempPath.split('/');
                            // let slice = split.slice(9);
                            // let finalPath = slice.join('/');
                            sourceFile.filename = gitProjectInput.projectStructure[i].fileName;
                            sourceFile.repoFilePath = gitProjectInput.projectStructure[i].filePath;
                            sourceFile.localFilePath = "something something darkside";
                            gitProjectInput.downloadedSourceFile.push(sourceFile);
                            await this.queryDownloadFiles(accessToken, user, body.values[iterator].slug, gitProjectInput.projectStructure[i].fileId, gitProjectInput.projectStructure[i].filePath);
                        }
                    }

                    allGitProjectInput.push(gitProjectInput);

                    iterator++;
                }

                console.log("\n\n\n success");

                return body;
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

    public async queryCommitInfo(accessToken: string, user: string, repoName: string): Promise <any[]> {
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
            .then(async body => {
                logger.info({
                    class: "bitbucketApi2",
                    method: "queryData",
                    action: "Result from bitbucket's api",
                    value: body
                }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

                let iterator = 0;
                let allCommits: Array<any> = new Array<any>();

                while (iterator < body.values.length) {

                    if (body.values[iterator].author.user != undefined) {
                        if (JSON.stringify(body.values[iterator].author.user.username).match(user)) {
                            let allSingleCommits: Array<any> = new Array<any>();
                            allSingleCommits = await this.queryDiffStats(accessToken, user, repoName, body.values[iterator].hash);
                            let commit: ICommit = new class implements ICommit {
                                files: ISingleFileCommit[];
                                id: string;
                                numberOfFileAffected: number;
                            }
                            commit.id = body.values[iterator].hash;
                            commit.numberOfFileAffected = allSingleCommits.length;
                            commit.files = allSingleCommits;

                            allCommits.push(commit);
                        }
                    }
                    iterator++;
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

    public async queryDiffStats(accessToken: string, user: string, repoName: string, hash: string): Promise <any[]> {
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
                    action: "Result from bitbucket's api diffstats",
                    value: body
                }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

                let singleCommitIndex: number = 0;
                let allSingleCommits: Array<any> = new Array<any>();

                while (singleCommitIndex < body.values.length) {

                    let singleFileCommit: ISingleFileCommit = new class implements ISingleFileCommit {
                        filePath: string;
                        lineAdded: number;
                        lineDeleted: number;
                    }
                    singleFileCommit.lineAdded = body.values[singleCommitIndex].lines_added;
                    singleFileCommit.lineDeleted = body.values[singleCommitIndex].lines_removed;

                    if (body.values[singleCommitIndex].new != undefined) {
                        singleFileCommit.filePath = body.values[singleCommitIndex].new.links.self.href.toString();
                    }
                    else {
                        singleFileCommit.filePath = body.values[singleCommitIndex].old.links.self.href.toString();
                    }

                    allSingleCommits.push(singleFileCommit);

                    singleCommitIndex++;
                }

                return allSingleCommits;

            }).catch(error => {
                logger.error({
                    class: "bitbucketApi2",
                    method: "queryData",
                    action: "Error from bitbucket's api: DIFF STATS: " + repoName + " hash " + hash + " token " + accessToken,
                    value: error
                }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                return error;
            });
    }

    public async querySourceFileInfo(accessToken: string, user: string, repoName: string): Promise <any> {
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
            .then(async body => {
                logger.info({
                    class: "bitbucketApi2",
                    method: "queryData",
                    action: "Result from bitbucket's api for repo slug",
                    value: body
                }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

                let fileIterator: number = 0;

                let allSourceFiles: Array<any> = new Array<any>();

                while (fileIterator < body.values.length) {
                    if (body.values[fileIterator].path = ".gitignore") {
                        let sourceFile: ISourceFiles =  new class implements ISourceFiles {
                            filename: string;
                            localFilePath: string;
                            repoFilePath: string;
                        }

                        sourceFile.filename = body.values[fileIterator].path;
                        sourceFile.repoFilePath = body.values[fileIterator].links.self.href;
                        // TODO: Figure out how to download the raw file
                        sourceFile.localFilePath = "https://bitbucket.org/" + user + "/" + repoName + "/" + body.values[fileIterator].path;
                        console.log("\n\n\n\n hash is this " + body.values[fileIterator].commit.hash);
                        await this.queryDownloadFiles(accessToken, user, repoName, body.values[fileIterator].commit.hash, body.values[fileIterator].path);

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

    public async queryProjectStructInfo(accessToken: string, user: string, repoName: string): Promise<any[]> {
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
            .then(async body => {
                logger.info({
                    class: "bitbucketApi2",
                    method: "queryData",
                    action: "Result from bitbucket's api for repo slug",
                    value: body
                }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

                let fileIterator: number = 0;
                let innerIterator: number = 0;
                let allProjectStruct: Array<any> = new Array<any>();

                while (fileIterator < body.values.length){
                    if (body.values[fileIterator].type == "commit_directory"){
                        let tempProjectStructure: Array<any> = new Array<any>();
                        tempProjectStructure = await this.queryDirectoryInfo(accessToken, user, repoName, body.values[0].commit.hash, body.values[fileIterator].path);

                        // for (let value of tempProjectStructure){
                        //     console.log("\n\n\n\n struct for loop bsssssss");
                        //     allProjectStruct.push(value);
                        // }
                        while (innerIterator < tempProjectStructure.length){
                            allProjectStruct.push(tempProjectStructure[innerIterator]);
                            innerIterator++;
                        }
                        innerIterator = 0;
                        tempProjectStructure = [];
                    }

                    if (body.values[fileIterator].type == "commit_file"){
                        let projStruct: IProjectStructure =  new class implements IProjectStructure {
                            fileId: string;
                            fileName: string;
                            filePath: string;
                        }

                        projStruct.fileId = body.values[0].commit.hash;
                        projStruct.filePath = body.values[fileIterator].path;
                        let tempPath = body.values[fileIterator].path;
                        let split = tempPath.split('/');
                        let slice = split.slice(split.length-1);
                        projStruct.fileName = slice;


                        allProjectStruct.push(projStruct);
                    }
                    fileIterator++;
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

    public async queryDirectoryInfo(accessToken: string, user: string, repoName: string, hash: string, path: string): Promise<any[]> {
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
            .then(async body => {
                logger.info({
                    class: "bitbucketApi2",
                    method: "queryData",
                    action: "Result from bitbucket's api for repo slug",
                    value: body
                }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});


                let fileIterator: number = 0;
                let innerIterator: number = 0;

                // let allProjectStruct: IProjectStructure[] = new Array();
                let allProjectStruct: Array<any> = new Array<any>();
                let bsCounter: number = 0;

                while (fileIterator < body.values.length) {

                    if (body.values[fileIterator].type === ("commit_directory")) {
                        let tempProjectStructure: Array<any> = new Array<any>();
                        tempProjectStructure = await this.queryDirectoryInfo(accessToken, user, repoName, hash, body.values[fileIterator].path);

                        // for (let value of tempProjectStructure){
                        //     bsCounter++;
                        //     console.log("\n\n\n this is the bsCounter " + bsCounter);
                        //     allProjectStruct.push(value);
                        // }
                        while (innerIterator < tempProjectStructure.length) {
                            allProjectStruct.push(tempProjectStructure[innerIterator]);
                            innerIterator++;
                        }
                        innerIterator = 0;
                        tempProjectStructure = [];
                    }
                    else if (body.values[fileIterator].type === ("commit_file")) {

                        let projStruct: IProjectStructure = new class implements IProjectStructure {
                            fileId: string;
                            fileName: string;
                            filePath: string;
                        };
                        projStruct.fileId = hash;
                        projStruct.filePath = body.values[fileIterator].path;
                        let tempPath = body.values[fileIterator].path;
                        let split = tempPath.split('/');
                        let slice = split.slice(split.length-1);
                        projStruct.fileName = slice;

                        allProjectStruct.push(projStruct);
                    }
                    else {
                        let emptyStruct: IProjectStructure = new class implements IProjectStructure {
                            fileId: string;
                            fileName: string;
                            filePath: string;
                        };
                        allProjectStruct.push(emptyStruct);
                    }
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

    public async queryDownloadFiles(accessToken: string, user: string, repoName: string, hash: string, fileName: string ): Promise<any> {
        logger.info({
            class: "bitbucketApi2",
            method: "queryData",
            action: "Querying bitbucket's api to download files",
            params: {accessToken, user}
        }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
        return fetch(`https://api.bitbucket.org/2.0/repositories/${user}/${repoName}/src/${hash}/${fileName}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        }).then(response => response.text())
            .then(body => {
                logger.info({
                    class: "bitbucketApi2",
                    method: "queryDownload",
                    action: "Result from bitbucket's api for downloading files",
                    value: body
                }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                //do stuff here
                console.log('\n\n\nthis is the query https://api.bitbucket.org/2.0/repositories/' + user + '/' + repoName + '/src/' + hash + '/' + fileName);
                console.log(body);

                return body;
            })
            .catch(error => {
                logger.error({
                    class: "bitbucketApi2",
                    method: "queryDownload",
                    action: "Error from bitbucket's api: DOWNLOAD FILE",
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