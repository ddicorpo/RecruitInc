import { Request, Response } from "express";
import {GitlabQueryExecutor} from "../../data-extraction/gitlab/query-executor/GitlabQueryExecutor";
import {UserQuery} from "../../data-extraction/gitlab/queries/UserQuery";
import {IGitlabUser} from "../../data-extraction/gitlab/api-entities/IGitlabUser";
import {IGitlabProject} from "../../data-extraction/gitlab/api-entities/IGitlabProject";
import {ProjectQuery} from "../../data-extraction/gitlab/queries/ProjectQuery";
import {RepositoryTreeQuery} from "../../data-extraction/gitlab/queries/RepositoryTreeQuery";
import {IGitlabRepositoryTree} from "../../data-extraction/gitlab/api-entities/IGitlabRepositoryTree";
import {IGitlabCommit} from "../../data-extraction/gitlab/api-entities/IGitlabCommit";
import {CommitQuery} from "../../data-extraction/gitlab/queries/CommitQuery";
import { FileDownloadQuery } from "../../data-extraction/gitlab/queries/FileDownloadQuery";
import { CommitDiffQuery } from "../../data-extraction/gitlab/queries/CommitDiffQuery";
import {IGitlabCommitDiff} from "../../data-extraction/gitlab/api-entities/IGitlabCommitDiff";
import {MatcherClient} from "../../matching-algo/matcher-client/MatcherClient"
import { IGitProjectOutput } from "../../matching-algo/data-model/output-model/IGitProjectOutput";

var logger = require('../../logger.js');

var cors = require('cors');

let dataFile: string = "log/info.json";

export class GitlabApplicants {

    public routes(app): void {

        app.route('/api/gitlab/matchingalgo/:username')
            .get(cors(), async (request: Request, response: Response) => {
                logger.info({class: "GitlabApplicants", method: "routes", action: "/api/gitlab/users/:username", value: {request, response}}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

                //To retrieve user information
                let username : string = request.params.username;
                let gitlabUserQueryExecutor = new GitlabQueryExecutor<IGitlabUser[]>();
                let userQuery: UserQuery = new UserQuery(username, gitlabUserQueryExecutor);
                userQuery.buildQuery();
                let gitlabUserPromise: Promise<IGitlabUser[]> = userQuery.executeQuery();
                let gitlabUsers: IGitlabUser[] = await gitlabUserPromise;
                
                let userId: number;
                try {
                     userId = gitlabUsers[0].id;
                     if(userId == undefined || userId == null){
                        throw new SyntaxError('Error has occured');
                     }
                }
                catch(err) {
                    
                      response.status(500).json({error: err.toString()});
                      return;
                  }
               
                let user: IGitlabUser = gitlabUsers[0];
               
                 //To retrieve all the projects
                let gitlabProjectQueryExecutor = new GitlabQueryExecutor<IGitlabProject[]>();
                let projectQuery: ProjectQuery = new ProjectQuery(userId, gitlabProjectQueryExecutor);
                projectQuery.buildQuery();
                let gitlabProjectPromise: Promise<IGitlabProject[]> = projectQuery.executeQuery();
                let gitlabProjects: IGitlabProject[] = await gitlabProjectPromise;
                
                user.dataEntry = { projectInputs: gitlabProjects.map(project => {
                    return {projectName: project.name,projectId: project.id ,applicantCommits:[], projectStructure: [],downloadedSourceFile:[]}
                })};
                
                let treeQuery: RepositoryTreeQuery;
                let project : IGitlabRepositoryTree[];

                let commitQuery: CommitQuery; 
                let commits: IGitlabCommit[];
                let moredata: IGitlabCommit[];
                let more_data_project : IGitlabRepositoryTree[];
                let propername: string = gitlabUsers[0].name;
                

                for(let i=0; i < user.dataEntry.projectInputs.length;i++){
                
                    let projectId: number = user.dataEntry.projectInputs[i]["projectId"];
                    
                    //To retrieve the projectStruture of each project
                    let numberOfpages: number = 1;
                    let gitlabTreeQueryExecutor = new GitlabQueryExecutor<IGitlabRepositoryTree[]>();
                    treeQuery = new RepositoryTreeQuery(projectId, gitlabTreeQueryExecutor);
                    treeQuery.buildQuery(numberOfpages);
                    let gitlabTreePromise: Promise<IGitlabRepositoryTree[]> = treeQuery.executeQuery();
                    project = await gitlabTreePromise;
                   
                    
                    if(project.length >= 100){
                        while(project.length %100 == 0){
                            numberOfpages+=1
                            treeQuery.buildQuery(numberOfpages);
                            let new_data_gitlabTreePromise: Promise<IGitlabRepositoryTree[]> = treeQuery.executeQuery();
                            more_data_project = await new_data_gitlabTreePromise;
                            project= project.concat(more_data_project);
                        }
                    } 
                    
                    
                    let project_with_tree: IGitlabRepositoryTree[]= [];
                    for(let m=0; m < project.length; m++){
                        if(project[m]["type"] == "tree"){
                            project_with_tree.push(project[m]);
                        };  
                    }

                    const project_with_blobs = project.filter(function( el ) {
                        return project_with_tree.indexOf( el ) < 0;
                      } );


                    gitlabProjects[i].projectStruture = [];
                    gitlabProjects[i].projectStruture = gitlabProjects[i].projectStruture.concat(project_with_blobs);

                    
                    user.dataEntry.projectInputs[i].projectStructure = user.dataEntry.projectInputs[i].projectStructure.concat(project_with_blobs.map(file => {
                        return {fileId: file.id, fileName: file.name, filePath: file.path};
                    }));

                    //to get all the commits of each project
                    let gitlabCommitQueryExecutor = new GitlabQueryExecutor<IGitlabCommit[]>();
                    commitQuery= new CommitQuery(projectId, gitlabCommitQueryExecutor);
                    commitQuery.buildQuery();
                    let gitlabCommitPromise: Promise<IGitlabCommit[]> = commitQuery.executeQuery();
                    commits = await gitlabCommitPromise;
                    
                    let created_At : string = commits[0]["created_at"];

                    if(commits.length >= 20){
                        while(created_At.length != 0 && commits.length % 20 == 0){
                            commitQuery.buildQueryTogetMoreData(projectId,created_At);
                            let newdata: Promise<IGitlabCommit[]> = commitQuery.executeQuery();
                            moredata = await newdata;
                            created_At = moredata[0]["created_at"];
                            commits = commits.concat(moredata);
                        } 
                    }  
                    
                    let commits_specific_user: IGitlabCommit[]= [];
                    for(let w=0; w < commits.length; w++){
                        if(commits[w]["author_name"] == propername){
                              commits_specific_user.push(commits[w]);
                        };  
                    }

                    gitlabProjects[i].commitsStructure = [];
                    gitlabProjects[i].commitsStructure = gitlabProjects[i].commitsStructure.concat(commits);

                    user.dataEntry.projectInputs[i].applicantCommits = commits_specific_user.map(commit=> {
                        return {id: commit.id, numberOfFileAffected: 0, files: []}
                    }) 


                    
                    for(let x =0; x < user.dataEntry.projectInputs[i].applicantCommits.length; x++){
                        
                        let gitlabCommitDiffQueryExecutor = new GitlabQueryExecutor<IGitlabCommitDiff[]>();
                        let commitSha1: string = user.dataEntry.projectInputs[i].applicantCommits[x].id;
                        let commitDiffQuery: CommitDiffQuery = new CommitDiffQuery(projectId, commitSha1, gitlabCommitDiffQueryExecutor);
                        commitDiffQuery.buildQuery();
                        let gitlabCommitDiffPromise: Promise<IGitlabCommitDiff[]> = commitDiffQuery.executeQuery();
                        let gitlabDiffCommit: IGitlabCommitDiff[] = await gitlabCommitDiffPromise;
                        user.dataEntry.projectInputs[i].applicantCommits[x].numberOfFileAffected = gitlabDiffCommit.length;
                        
                        user.dataEntry.projectInputs[i].applicantCommits[x].files = []
                        for(let r=0; r < gitlabDiffCommit.length; r++){
                              let filepath: string = gitlabDiffCommit[r].new_path;
                              let diff: string = gitlabDiffCommit[r].diff;
                              let addition: number = (diff.match(/\n\+/g) || []).length;
                              let deletion: number = (diff.match(/\n\-/g) || []).length;
                              user.dataEntry.projectInputs[i].applicantCommits[x].files.push({filePath:filepath,lineAdded: addition,lineDeleted:deletion})
                        }
                    }
                 
                    
                }
                
                
                 if (user.dataEntry.projectInputs == null || user.dataEntry.projectInputs.length == 0){
                    return user;
                }
                
                for (let repository of user.dataEntry.projectInputs){
                    let project_id: number= repository["projectId"];

                    if (repository.projectStructure == null || repository.projectStructure.length == 0){
                        continue;
                    }
                    if(!(repository.downloadedSourceFile)){
                        repository.downloadedSourceFile = [];
                    } 
                    for (let file of repository.projectStructure){
                        if (file.fileName == "package.json"){
                            let gitlabFileDownloadExecutor = new GitlabQueryExecutor<any>();
                            let fileDownloadQuery : FileDownloadQuery = new FileDownloadQuery(project_id,file.fileId,gitlabFileDownloadExecutor);
                            fileDownloadQuery.buildQuery(); 
                            let gitlabFileDownloadPromise: Promise<any> = fileDownloadQuery.executeDownloadQuery();
                            let gitlabFileDownload: {content: string} = await gitlabFileDownloadPromise;
                            let generatedPath : string = fileDownloadQuery.generatePath(user.username, repository.projectName, file.filePath);
                            fileDownloadQuery.writeToFile(gitlabFileDownload.content, generatedPath)
                            repository.downloadedSourceFile.push({filename: file.fileName, repoFilePath: file.filePath, localFilePath: generatedPath });
                        }
                    } 
                
                }
                

                let client: MatcherClient = new MatcherClient(user.dataEntry)
                let output: IGitProjectOutput[] = client.execute();
              
                let returnValue = {
                    userQuery: userQuery.getQuery(),
                    userResponse: gitlabUsers,

                    matching_algo_output : output

                };
                response.status(200).send(returnValue);
               

            });

        app.route('/api/gitlab/download/:projectId/:blobSha')
            .get(cors(), async (request: Request, response: Response) => {               
              
              let projectId : number = request.params.projectId;
              let blobSha : string = request.params.blobSha;
              let gitlabFileDownloadExecutor = new GitlabQueryExecutor<any>();
              let fileDownloadQuery : FileDownloadQuery = new FileDownloadQuery(projectId,blobSha,gitlabFileDownloadExecutor);
              fileDownloadQuery.buildQuery();
              let gitlabFileDownloadPromise: Promise<any> = fileDownloadQuery.executeDownloadQuery();
              let gitlabFileDownload = await gitlabFileDownloadPromise;
              
              let returnValue = {
                
                fileDownloadQuery:fileDownloadQuery.getQuery(),
                gitlabFileDownloadReponse: gitlabFileDownload
            };
            
            response.status(200).send(returnValue);

           });   
            
    }
}