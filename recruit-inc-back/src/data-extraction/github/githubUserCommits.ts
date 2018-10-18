import { GithubApiV4} from "./githubApiV4";
import {IGithubUser} from "./api-entities/IGithubUser"

export class GithubUserRepos {
    private readonly accessToken: string;
    
    public constructor(accessToken: string = "37780cb5a0cd8bbedda4c9537ebf348a6e402baf" ) {
      this.accessToken = accessToken;
  }

    async firstQuery(username: string): Promise<string> {
        let query : string =

        `query {
            repository(name: "RecruitInc", owner: "ddicorpo") {
                ref(qualifiedName: "master") {
                  target {
                    ... on Commit {

                        author {
                            name
                            email
                            date
                          }
                      id
                      history(author : {emails: "benjamin.tanguay@gmail.com"}first: 100) {
            
                         
                                        
                                      
                        pageInfo {
                          hasNextPage
                        }
                        
                        edges {
                          
                          node {
                        pushedDate
                            oid
                            changedFiles
                            commitUrl  
                            
                          
                            commitResourcePath
                            message
                            
                          }
                        }
                      }
                    }
            }
            }
                  }
                } `;
                
                return await new GithubApiV4().queryData(this.accessToken, query);
    }                               
    async getDataAfterCursor(username: string, endCursor: string): Promise<string> {

        let query : string =

        `query {
            repository(name: "RecruitInc", owner: "ddicorpo") {
                ref(qualifiedName: "master") {
                  target {
                    ... on Commit {

                        author {
                            name
                            email
                            date
                          }
                      id
                      history(author : {emails: "benjamin.tanguay@gmail.com"}first: 100, after: ${endCursor}) {
            
                         
                                        
                                      
                        pageInfo {
                          hasNextPage
                        }
                        
                        edges {
                          
                          node {
                        pushedDate
                            oid
                            changedFiles
                            commitUrl  
                            
                          
                            commitResourcePath
                            message
                            
                          }
                        }
                      }
                    }
            }
            }
                  }
                } `;
                
                return await new GithubApiV4().queryData(this.accessToken, query);








    }

              


   
}
