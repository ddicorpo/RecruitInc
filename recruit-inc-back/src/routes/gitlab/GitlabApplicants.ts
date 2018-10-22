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
                let userId: number = gitlabUsers[0].id;
                
                //To retrieve all the projects
                let gitlabProjectQueryExecutor = new GitlabQueryExecutor<IGitlabProject[]>();
                let projectQuery: ProjectQuery = new ProjectQuery(userId, gitlabProjectQueryExecutor);
                projectQuery.buildQuery();
                let gitlabProjectPromise: Promise<IGitlabProject[]> = projectQuery.executeQuery();
                let gitlabProjects: IGitlabProject[] = await gitlabProjectPromise;
                
                let treeQuery: RepositoryTreeQuery;
                let project : IGitlabRepositoryTree[];
               
                let commitQuery: CommitQuery; 
                let commits: IGitlabCommit[];
                let moredata: IGitlabCommit[];
              
                for(let i=0; i < gitlabProjects.length;i++){
                
                    let projectId: number = gitlabProjects[i].id;
                
                     //To retrieve the projectStruture of each project
                    let gitlabTreeQueryExecutor = new GitlabQueryExecutor<IGitlabRepositoryTree[]>();
                    treeQuery = new RepositoryTreeQuery(projectId, gitlabTreeQueryExecutor);
                    treeQuery.buildQuery();
                    let gitlabTreePromise: Promise<IGitlabRepositoryTree[]> = treeQuery.executeQuery();
                    project = await gitlabTreePromise;
                    gitlabProjects[i].projectStruture = [];
                    gitlabProjects[i].projectStruture = gitlabProjects[i].projectStruture.concat(project);

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
    }
}