import { GithubApiV4 } from './githubApiV4';

export class GithubUserInfo {
  private readonly accessToken: string;

  public constructor(
    accessToken: string = process.env.GITHUB_DEFAULT_AUTH_TOKEN
  ) {
    this.accessToken = accessToken;
  }

  async firstQuery(location: string): Promise<string> {
    let query: string = `{
             search(query: "type:user location:${location} sort:joined",  first: 100, type: USER) {
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
                     createdAt
                   }
                 }
               }
             }`;

    return await new GithubApiV4().queryData(this.accessToken, query);
  }

  async getData(location: string, endCursor: string): Promise<string> {
    let query: string = `{
             search(query: "type:user location:${location} sort:joined", after: ${endCursor}, first: 100, type: USER) {
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
                     createdAt
                   }
                 }
               }
             }`;

    return await new GithubApiV4().queryData(this.accessToken, query);
  }

  async getDataBefore(
    location: string,
    lastCreatedAt: string
  ): Promise<string> {
    let query: string = `{
             search(query: "type:user location:${location} sort:joined created:<${lastCreatedAt}", first: 100, type: USER) {
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
                     createdAt
                   }
                 }
               }
             }`;

    return await new GithubApiV4().queryData(this.accessToken, query);
  }

  async getDataBeforeWithEndCursor(
    location: string,
    lastCreatedAt: string,
    endCursor: string
  ): Promise<string> {
    let query: string = `{
             search(query: "type:user location:${location} sort:joined created:<${lastCreatedAt}", after: ${endCursor}, first: 100, type: USER) {
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
                     createdAt
                   }
                 }
               }
             }`;

    return await new GithubApiV4().queryData(this.accessToken, query);
  }
}
