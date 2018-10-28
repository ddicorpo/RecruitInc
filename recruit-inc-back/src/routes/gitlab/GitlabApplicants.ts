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
import { IGithubUser } from "../../data-extraction/github/api-entities/IGithubUser";
var logger = require('../../logger.js');

var cors = require('cors');

let dataFile: string = "log/info.json";

export class GitlabApplicants {

    public routes(app): void {

        app.route('/api/gitlab/users/:username')
            .get(cors(), async (request: Request, response: Response) => {
                logger.info({class: "GitlabApplicants", method: "routes", action: "/api/gitlab/users/:username", value: {request, response}}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

                //To retrieve user information
                let username : string = request.params.username;
                let gitlabUserQueryExecutor = new GitlabQueryExecutor<IGitlabUser[]>();
                let userQuery: UserQuery = new UserQuery(username, gitlabUserQueryExecutor);
                userQuery.buildQuery();
                let gitlabUserPromise: Promise<IGitlabUser[]> = userQuery.executeQuery();
                let gitlabUsers: IGitlabUser[] = await gitlabUserPromise;
                //console.log(gitlabUsers);
                let userId: number = gitlabUsers[0].id;
                let user: IGitlabUser = gitlabUsers[0];
                //let user: IGitlabUser = {"id":212577,"name":"Roberto Rosario","username":"rosarior","state":"active","avatar_url":"https://secure.gravatar.com/avatar/943620c3bc4056a40ce132690f1d9ac1?s=80&d=identicon","web_url":"https://gitlab.com/rosarior"}

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
                    
                    user.dataEntry.projectInputs[i].applicantCommits = commits.map(commit=> {
                        return {id: commit.id, numberOfFileAffected: 0, files: []}
                    }) 
                    
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
                    
                   
                    for(let w=0; w < commits.length; w++){
                        if(commits[w]["author_name"] != propername){
                              commits.splice(w,1);
                        };  
                    }

                    
                    gitlabProjects[i].commitsStructure = [];
                    gitlabProjects[i].commitsStructure = gitlabProjects[i].commitsStructure.concat(commits);
                }   

                let returnValue = {
                    userQuery: userQuery.getQuery(),
                    userResponse: gitlabUsers,
                    
                    projectQuery: projectQuery.getQuery(),
                    projectResponse: gitlabProjects

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