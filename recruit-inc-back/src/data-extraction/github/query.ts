import { GithubApiV4} from "./githubApiV4";

export class Query {
    private readonly accessToken: string;

    public constructor(accessToken: string){
        this.accessToken = accessToken;
    }

    async getData(username: string): Promise<string> {
        let query : string =
            `query {
                user(login: "${username}") {
                  repositories(first: 10, isFork: false) {
                    nodes {
                      name
                      url
                      languages(first:5) {
                        nodes {
                          name
                          
                        }
                      }
                    }
                  }
    
                  pullRequests(last: 10, states: [CLOSED]) {
                    edges {
                      node {
                        title 
                      }
                    }
        }

        issues(last:20, states:CLOSED) {
            edges {
              node {
                title
                url
                labels(first:5) {
                  edges {
                    node {
                      name
                    }
                  }
                }
              }
            }
          }
    }

}


























                    
                                                

                            comments(last: 10) {
                              edges {
                                node {
                                  author {
                                    name

                                    defaultBranchRef{
                                        target{
                                          ... on Commit{
                                            changedFiles
                                            additions
                                            deletions
                                          }
                                        }
                                  }
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