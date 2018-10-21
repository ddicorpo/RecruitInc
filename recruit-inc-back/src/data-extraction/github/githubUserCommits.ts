import { GithubApiV4} from "./githubApiV4";
import {IGithubUser} from "./api-entities/IGithubUser"

export class GithubUserCommits {
    private readonly accessToken: string;
    
    public constructor(accessToken: string = "37780cb5a0cd8bbedda4c9537ebf348a6e402baf" ) {
      this.accessToken = accessToken;
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

   
}
