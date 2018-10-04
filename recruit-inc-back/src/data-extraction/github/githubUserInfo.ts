import { GithubApiV4} from "./githubApiV4";

export class GithubUserInfo {
    private readonly accessToken: string;

    public constructor(){
        this.accessToken = "37780cb5a0cd8bbedda4c9537ebf348a6e402baf";
    }

    async firstQuery(location: string): Promise<string> {
        let query : string =
            `{
             search(query: "type:user location:${location}",  first: 100, type: USER) {
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

    async getData(location: string, endCursor: string): Promise<string> {
        let query : string =
            `{
             search(query: "type:user location:${location}", after: ${endCursor}, first: 100, type: USER) {
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
