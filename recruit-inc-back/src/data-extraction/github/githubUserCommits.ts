import { GithubApiV4} from "./githubApiV4";
import { GithubApiV3} from "./githubApiV3";
import {IGithubUser} from "./api-entities/IGithubUser"

export class GithubUserCommits {
    private readonly accessToken: string;
    
    public constructor(accessToken: string = "37780cb5a0cd8bbedda4c9537ebf348a6e402baf" ) {
      this.accessToken = accessToken;
  }

  async getUserCommits(ownerzz: string, repozzz:string, sha:string): Promise<string> {
    return await new GithubApiV3().queryUserCommits( ownerzz, repozzz, sha);
}

    async gwt(RepoName: string, OwnerUsername: string, UserEmail: string): Promise<string> {
       

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

    async gwtNext(RepoName: string, OwnerUsername: string, UserEmail: string, endCursor: string): Promise<string> {
       

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

  async getCommits(repository: string, owner: string, userEmail: string): Promise<any[]> {

    let result : any[] = [];
    let data: string = await this.gwt(repository, owner, userEmail);
    let jsonData = JSON.parse(data);
    let pageInfo = jsonData.data.repository.ref.target.history.pageInfo;
    let edges = jsonData.data.repository.ref.target.history.edges;
    let hasNextPage = pageInfo.hasNextPage;
    let endCursor : string = JSON.stringify(pageInfo.endCursor);

    for (let node of edges){
        result.push(node);
    }

    while(hasNextPage){
      let nextData : string = await this.gwtNext(repository, owner, userEmail, endCursor);
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
