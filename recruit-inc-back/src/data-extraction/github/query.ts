import { GithubApiV4} from "./githubApiV4";

export class Query {
    private readonly accessToken: string;

    public constructor(accessToken: string){
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


    async getDataHardCoded(): Promise<string> {
      let query : string =
          `query
          {
           user(login: "rena-21") {
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

      return await new GithubApiV4().queryData("3bb270dc6fa9c761c2f17f225d4955d744c377d2", query);
  }









}