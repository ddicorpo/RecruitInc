import fetch from "node-fetch";
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

                    let gitProjectInput: IGitProjectInput = new class implements IGitProjectInput {
                        applicantCommits: ICommit[];
                        downloadedSourceFile: ISourceFiles[] = [];
                        projectName: string;
                        projectStructure: IProjectStructure[];
                    }


                    gitProjectInput.projectName = body.values[iterator].slug;
                    gitProjectInput.applicantCommits = await this.queryCommitInfo(accessToken, user, body.values[iterator].slug);
                    gitProjectInput.projectStructure = await this.queryProjectStructInfo(accessToken, user, body.values[iterator].slug);

                    for(let i = 0; i < gitProjectInput.projectStructure.length; i++){

                        if(gitProjectInput.projectStructure[i].fileName == ".gitignore" || gitProjectInput.projectStructure[i].fileName == "package.json") {
                            let sourceFile: ISourceFiles =  new class implements ISourceFiles {
                                filename: string;
                                localFilePath: string;
                                repoFilePath: string;
                            }

                            sourceFile.filename = gitProjectInput.projectStructure[i].fileName;
                            sourceFile.repoFilePath = gitProjectInput.projectStructure[i].filePath;
                            let generatedPath : string = this.generatePath(user, gitProjectInput.projectName, sourceFile.repoFilePath);
                            sourceFile.localFilePath = generatedPath;
                            gitProjectInput.downloadedSourceFile.push(sourceFile);
                            await this.queryDownloadFiles(accessToken, user, body.values[iterator].slug, gitProjectInput.projectStructure[i].fileId, gitProjectInput.projectStructure[i].filePath, generatedPath);
                        }
                    }

                    allGitProjectInput.push(gitProjectInput);

                    iterator++;
                }

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

                let allProjectStruct: Array<any> = new Array<any>();

                while (fileIterator < body.values.length) {

                    if (body.values[fileIterator].type === ("commit_directory")) {
                        let tempProjectStructure: Array<any> = new Array<any>();
                        tempProjectStructure = await this.queryDirectoryInfo(accessToken, user, repoName, hash, body.values[fileIterator].path);

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

    public async queryDownloadFiles(accessToken: string, user: string, repoName: string, hash: string, fileName: string, generatedPath: string): Promise<any> {
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

                this.writeToFile(body, generatedPath);


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

    //This function creates directories as needed
    //So that when we try to write to a file with fs it does not throw an error
    writeToFile(content: string, path: string){
        let notExist = path.split('/');
        let exists : string = "";
        for (let i = 0; i < notExist.length-1; i++){
            exists+=`${notExist[i]}/`;
            if (fs.existsSync(exists))
                continue;
            else
                fs.mkdirSync(exists);
        }

        fs.writeFile(path, content, (err)=>{
            if (err) throw err;
        });
    }

    generatePath(username: string, repoName: string, filePath: string) : string {
        return `downloaded/${username}/bitbucket/${repoName}/${filePath}`;
    }

}