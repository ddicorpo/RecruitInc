import { GithubApiV4} from "./githubApiV4";

export class Query {
    private readonly accessToken: string;
    
    public constructor(accessToken: string = "37780cb5a0cd8bbedda4c9537ebf348a6e402baf" ) {
      this.accessToken = accessToken;
  }


    async getData(username: string): Promise<string> {
        let query : string =
            `query
            {
             user(login: "${username}") {
               repositories(first: 10, isFork: false) {
                 nodes {
                   name
                   url
                   languages(first: 5) {
                     nodes {
                       name
                     }
                   }
                   pullRequest(number: 2) {
                     id
                     number
                     title
                   }
                 }
               }
             }
            } `;

        return await new GithubApiV4().queryData(this.accessToken, query);
    }
}