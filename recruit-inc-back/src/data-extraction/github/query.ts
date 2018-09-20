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
                    }
                    pullRequests(last: 10, states: [OPEN]) {
                        edges {
                          node {
                            title
                            comments(last: 10) {
                              edges {
                                node {
                                  author {
                                    name
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