import { GithubApiV4} from "./githubApiV4";
import { GithubApiV3} from "./githubApiV3";
import {IGithubUser} from "./api-entities/IGithubUser"
import {ISingleFileCommit} from "../../matching-algo/data-model/input-model/ISingleFileCommit"

const logger = require('../../../src/logger.js');

export class GithubUserCommits {
    private readonly accessToken: string;
    
    public constructor(accessToken: string = "37780cb5a0cd8bbedda4c9537ebf348a6e402baf" ) {
      this.accessToken = accessToken;
  }


  async getFilesAffectedByCommit(owner: string, repo: string, sha: string): Promise<{filePath: string, lineAdded: number, lineDeleted: number}[]> {
    let result : {filePath: string, lineAdded: number, lineDeleted: number}[] = [];
    let data : string ;
    let jsonData;
    try{
    data = await new GithubApiV3().queryUserCommits(this.accessToken, owner, repo, sha);

    jsonData = JSON.parse(data);
    if (!(jsonData.hasOwnProperty('files')) )
        throw new Error('You probably triggered the api\'s abuse detecting mechanism.');
    }catch(error){
          logger.error({class: "GithubUserCommits", method: "getFilesAffectedByCommit", action: "Error while trying to obtain the files affected by a given commit.", value: error.toString()}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
        return result;
    }
    
    let files = jsonData.files;
    for (let file of files){
        //In this case, file.filename returns the file path
        result.push({filePath: file.filename, lineAdded:  file.additions, lineDeleted: file.deletions});
    }
    return result;
}

  async getFilesAffectedByCommitFromUser(user: IGithubUser): Promise<IGithubUser> {
      if (user.dataEntry.projectInputs == null || user.dataEntry.projectInputs.length == 0){
          return user;
      }
      for (let repository of user.dataEntry.projectInputs){
          if (repository.applicantCommits == null || repository.applicantCommits.length == 0 ){
              continue;
          }
          for (let commit of repository.applicantCommits){
              if (commit.id == null) {
                  continue;
              }
              commit.files = await this.getFilesAffectedByCommit(repository.owner, repository.projectName, commit.id )
          }
      }
      return user;
}
    async GetCommitsSpecificToUser(RepoName: string, OwnerUsername: string, ID: string): Promise<string> {
       

        let query : string =
            `query {
  
              repository(name: "${RepoName}", owner: "${OwnerUsername}") {
                  ref(qualifiedName: "master") {
                    target {
                      ... on Commit {
                        history(author : {id: "${ID}"} first: 100) { 
                          pageInfo{
                            hasNextPage
                            endCursor
                          }
                          edges {
                            node {
                              oid
                              changedFiles
                            }
                          }
                        }
                      }
                    }
                 }
                }
              }`;

        return await new GithubApiV4().queryData(this.accessToken, query);
              
    }     

    async GetCommitsSpecificToUserNext(RepoName: string, OwnerUsername: string, ID: string, endCursor: string): Promise<string> {
       

      let query : string =
          `query {
            repository(name: "${RepoName}", owner: "${OwnerUsername}") {
                ref(qualifiedName: "master") {
                  target {
                    ... on Commit {
                      history(author : {id: "${ID}"} first: 100, after: ${endCursor}) { 
                        pageInfo{
                          hasNextPage
                          endCursor
                        }
                        edges {
                          node {
                            oid
                            changedFiles
                          }
                        }
                      }
                    }
                  }
               }
              }
            }`;

      return await new GithubApiV4().queryData(this.accessToken, query);
            
  }     

    async queryUserID(Login: string): Promise<string> {

      let query : string =
          `query {
            user(login: "${Login}"){
             id
             }
            }`;

      return await new GithubApiV4().queryData(this.accessToken, query);
  }     

    async getUserID(Login: string): Promise<string> {
        let data : string;
        let id : string;
        let jsonData : any = {} ;
        data = await this.queryUserID(Login);
        try{
        jsonData = JSON.parse(data);
        if ((!jsonData.data) || (!jsonData.data.user))
            throw new TypeError(`The User (${Login}) you are trying to query does not exist.`);
        }catch(error){
              logger.error({class: "GithubUserCommits", method: "getUserID", action: "Error while trying to obtain the id of a given github user.", value: error.toString()}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
            return "";
        }

        id = jsonData.data.user.id;
        return id;
  }     
  async getCommitsFromUser(user: IGithubUser): Promise<IGithubUser> {
      if (user.dataEntry.projectInputs == null || user.dataEntry.projectInputs.length == 0)
          return user;
      if ((!user.id) || user.id === "")
          user.id = await this.getUserID(user.login);
      
      for (let repository of user.dataEntry.projectInputs){
          repository.applicantCommits = await this.getCommits(repository.projectName, repository.owner, user.id)
      }
      return user;
}
  async getCommits(repository: string, owner: string, userID: string): Promise<{id: string, numberOfFileAffected: number, files: ISingleFileCommit[]}[]> {

    let result : any[] = [];
    let data: string ;
    let jsonData : any = {} ;
    data = await this.GetCommitsSpecificToUser(repository, owner, userID);
    try{
    jsonData = JSON.parse(data);
    if (!jsonData.data.repository.ref)
        throw new TypeError(`The Repository (${repository}) you are trying to query is empty.`);
    }catch(error){
          logger.error({class: "GithubUserCommits", method: "getCommits", action: "Error while trying to obtain the commits from a given github user.", value: error.toString()}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
        return [];
    }

    let pageInfo = jsonData.data.repository.ref.target.history.pageInfo;
    let edges = jsonData.data.repository.ref.target.history.edges;
    let hasNextPage = pageInfo.hasNextPage;
    let endCursor : string = JSON.stringify(pageInfo.endCursor);

    for (let node of edges){
        result.push(node);
    }

    while(hasNextPage){
      let nextData : string = await this.GetCommitsSpecificToUserNext(repository, owner, userID, endCursor);
      jsonData = JSON.parse(nextData);
      edges = jsonData.data.repository.ref.target.history.edges;
      pageInfo = jsonData.data.repository.ref.target.history.pageInfo;
      endCursor = JSON.stringify(pageInfo.endCursor);
      hasNextPage = pageInfo.hasNextPage;

    for (let node of edges){
        result.push(node);
    }
      data+=nextData;
    }

    return result.map( commit => {
        return {id: commit.node.oid, numberOfFileAffected: commit.node.changedFiles, files: []};
    });
}

   
}
