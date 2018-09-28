import { GithubApiV4} from "./githubApiV4";

export class GithubUserInfo {
    private readonly accessToken: string;

    public constructor(accessToken: string){
        this.accessToken = accessToken;
    }

    async getData(location: string): Promise<string> {
        let query : string =
            `{
             search(query: "type:user location:'${location}'",  first: 100, type: USER) {
               userCount
               pageInfo {
                  endCursor
                  hasNextPage
                }
                 nodes {
                   ... on User {
                     login
                     location
                     email
                     company
                     isHireable
                     url
                     websiteUrl
                   }
                 }
               }
             }`;

        return await new GithubApiV4().queryData(this.accessToken, query);
    }
}
