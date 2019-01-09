import { GithubApiV4 } from './githubApiV4';
import { IGithubUser } from './api-entities/IGithubUser';

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

  async getUserByLocation(location: string): Promise<IGithubUser[]> {
    let githubUsers: IGithubUser[];
    //Grab the endCursor from the first query
    let data: string = await this.firstQuery(location);
    let jsonData = JSON.parse(data);
    let pageInfo = jsonData.data.search.pageInfo;
    let endCursor: string = JSON.stringify(pageInfo.endCursor);
    let hasNextPage: boolean = pageInfo.hasNextPage;

    githubUsers = jsonData.data.search.nodes;

    //Use endCursor in subsequent queries to retrieve more users
    while (hasNextPage) {
      let nextData: string = await this.getData(location, endCursor);
      jsonData = JSON.parse(nextData);
      pageInfo = jsonData.data.search.pageInfo;
      endCursor = JSON.stringify(pageInfo.endCursor);
      hasNextPage = pageInfo.hasNextPage;
      data += nextData;
      githubUsers.push(jsonData.data.search.nodes);
    }

    //Loop until a search where no users are returned
    //using the createdAt parameter to get new users
    while (1) {
      let lastCreatedAt: string =
        jsonData.data.search.nodes[jsonData.data.search.nodes.length - 1]
          .createdAt;
      let nextData: string = await this.getDataBefore(location, lastCreatedAt);
      jsonData = JSON.parse(nextData);
      pageInfo = jsonData.data.search.pageInfo;
      endCursor = JSON.stringify(pageInfo.endCursor);
      hasNextPage = pageInfo.hasNextPage;
      data += nextData;
      githubUsers.push(jsonData.data.search.nodes);

      if (!hasNextPage) break;

      while (hasNextPage) {
        let nextData: string = await this.getDataBeforeWithEndCursor(
          location,
          lastCreatedAt,
          endCursor
        );
        jsonData = JSON.parse(nextData);
        pageInfo = jsonData.data.search.pageInfo;
        endCursor = JSON.stringify(pageInfo.endCursor);
        hasNextPage = pageInfo.hasNextPage;
        data += nextData;
        githubUsers.push(jsonData.data.search.nodes);
      }
    }
    return githubUsers;
  }
}
