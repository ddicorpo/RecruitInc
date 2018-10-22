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
                        id
                        history(author : {emails: "${UserEmail}"} first: 100) { 

                          pageInfo{
                            hasNextPage
                            endCursor
                          }
                          edges {
                            
                            node {
                          pushedDate
                              oid
                              changedFiles
                              commitUrl  
                              
                              treeUrl
                              commitResourcePath
                              message
                              author {
                                name
                                email
                                date
                              
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
                      id
                      history(author : {emails: "${UserEmail}"} first: 100, after: ${endCursor}) { 

                        pageInfo{
                          hasNextPage
                          endCursor
                        }
                        edges {

                          
                          node {
                        pushedDate
                            oid
                            changedFiles
                            commitUrl  
                            
                            treeUrl
                            commitResourcePath
                            message
                            author {
                              name
                              email
                              date
                            
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
  async getCommits(RepoName: IGithubUser, OwnerUsername: IGithubUser, UserEmail: IGithubUser ): Promise<IGithubUser> {

    let data: string = await this.gwt(RepoName.repositories.name, OwnerUsername.repositories.owner.login, UserEmail.email );
    let jsonData = JSON.parse(data);
    let pageInfo = jsonData.data.user.repositories.pageInfo;
    let hasNextPage = pageInfo.hasNextPage;
    let endCursor : string = JSON.stringify(pageInfo.endCursor);
    RepoName.repositories = jsonData.data.RepoName.repositories.nodes;
    OwnerUsername.repositories = jsonData.data.OwnerUsername.repositories.nodes;
    UserEmail.repositories = jsonData.data.UserEmail.repositories.nodes;

        
    while(hasNextPage){
      let nextData : string = await this.gwtNext(RepoName.repositories.name,OwnerUsername.repositories.owner.login,UserEmail.email, endCursor);
      jsonData = JSON.parse(nextData);
      pageInfo = jsonData.data.user.repositories.pageInfo;
      endCursor = JSON.stringify(pageInfo.endCursor);
      hasNextPage = pageInfo.hasNextPage;

      RepoName.repositories += jsonData.data.RepoName.repositories.nodes;
    OwnerUsername.repositories += jsonData.data.OwnerUsername.repositories.nodes;
    UserEmail.repositories += jsonData.data.UserEmail.repositories.nodes;
      
      data+=nextData;
    }


    return RepoName;
    


}

   
}
