import { GithubApiV4} from "./githubApiV4";
import { GithubApiV3} from "./githubApiV3";
import {IGithubUser} from "./api-entities/IGithubUser"

export class GithubUserCommits {
    private readonly accessToken: string;
    
    public constructor(accessToken: string = "37780cb5a0cd8bbedda4c9537ebf348a6e402baf" ) {
      this.accessToken = accessToken;
  }

  async getFilesAffectedByCommit(ownerzz: string, repozzz: string, sha: string): Promise<{filename: string, additions: number, deletions: number}[]> {
    let result : {filename: string, additions: number, deletions: number}[] = [];
    let data : string ;
    let jsonData;
    try{
    data = await new GithubApiV3().queryUserCommits(this.accessToken, ownerzz, repozzz, sha);
    jsonData = JSON.parse(data);
    if (!(jsonData.hasOwnProperty('files')))
        throw new Error('Something went wrong');
    }catch(e){
        console.log(e);
        return;
    }
    let files = jsonData.files;
    for (let file of files){
        result.push({filename: file.filename, additions:  file.additions, deletions: file.deletions});
    }
    return result;
}

  async getFilesAffectedByCommitFromUser(user: IGithubUser): Promise<IGithubUser> {
      if (user.repositories == null || user.repositories.length == 0)
          return user;
      for (let repository of user.repositories){
          if (repository.commits == null || repository.commits.length == 0 )
              continue;
          for (let commit of repository.commits){
              if (commit["node"]["oid"] == null) continue;
              commit.singleFileCommit = await this.getFilesAffectedByCommit(repository.owner.login, repository.name, commit["node"]["oid"] )
          }
      }
      return user;
}
    async GetCommitsSpecificToUser(RepoName: string, OwnerUsername: string, UserEmail: string): Promise<string> {
       

        let query : string =
            `query {
  
              repository(name: "${RepoName}", owner: "${OwnerUsername}") {
                  ref(qualifiedName: "master") {
                    target {
                      ... on Commit {
                        history(author : {emails: "${UserEmail}"} first: 100) { 
                          pageInfo{
                            hasNextPage
                            endCursor
                          }
                          edges {
                            node {
                              oid
                              changedFiles
                              author {
                                name
                                email
                              }
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

    async GetCommitsSpecificToUserNext(RepoName: string, OwnerUsername: string, UserEmail: string, endCursor: string): Promise<string> {
       

      let query : string =
          `query {
            repository(name: "${RepoName}", owner: "${OwnerUsername}") {
                ref(qualifiedName: "master") {
                  target {
                    ... on Commit {
                      history(author : {emails: "${UserEmail}"} first: 100, after: ${endCursor}) { 
                        pageInfo{
                          hasNextPage
                          endCursor
                        }
                        edges {
                          node {
                            oid
                            changedFiles
                            author {
                              name
                              email
                            }
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

  async getCommitsFromUser(user: IGithubUser): Promise<IGithubUser> {
      if (user.repositories == null || user.repositories.length == 0)
          return user;
      for (let repository of user.repositories){
          repository.commits = await this.getCommits(repository.name, repository.owner.login, user.email)
      }
      return user;
}
  async getCommits(repository: string, owner: string, userEmail: string): Promise<{oid: string, changedFiles: number, author:{name: string, email: string}}[]> {

    let result : any[] = [];
    let data: string = await this.GetCommitsSpecificToUser(repository, owner, userEmail);
    let jsonData = JSON.parse(data);
    let pageInfo = jsonData.data.repository.ref.target.history.pageInfo;
    let edges = jsonData.data.repository.ref.target.history.edges;
    let hasNextPage = pageInfo.hasNextPage;
    let endCursor : string = JSON.stringify(pageInfo.endCursor);

    for (let node of edges){
        result.push(node);
    }

    while(hasNextPage){
      let nextData : string = await this.GetCommitsSpecificToUserNext(repository, owner, userEmail, endCursor);
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
    return result;
}

   
}
