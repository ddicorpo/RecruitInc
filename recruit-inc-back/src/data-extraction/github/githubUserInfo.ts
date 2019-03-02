import { GithubApiV4 } from './githubApiV4';
import { IGithubUser } from './api-entities/IGithubUser';
import * as process from 'process';

export class GithubUserInfo {
  private readonly accessToken: string;
  private githubUsers: IGithubUser[];

  public constructor(
    accessToken: string = process.env.GITHUB_DEFAULT_AUTH_TOKEN
  ) {
    this.accessToken = accessToken;
  }

  setGithubUsers(githubUsers: IGithubUser[]) {
    this.githubUsers = githubUsers;
  }

  getGithubUsers() {
    return this.githubUsers;
  }

  async firstQuery(location: string): Promise<string> {
    let query: string = `{
             search(query: "type:user location:${location} sort:joined",  first: 100, type: USER) {
               userCount
               pageInfo {
                  endCursor
                  hasNextPage
                }
                edges{
                  cursor
                 node {
                   ... on User {
                     login
                     location
                     email
                     company
                     isHireable
                     url
                     websiteUrl
                     createdAt
                     id
                   }
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
                 edges{
                  cursor
                 node {
                   ... on User {
                     login
                     location
                     email
                     company
                     isHireable
                     url
                     websiteUrl
                     createdAt
                     id
                   }
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
                 edges{
                  cursor
                 node {
                   ... on User {
                     login
                     location
                     email
                     company
                     isHireable
                     url
                     websiteUrl
                     createdAt
                     id
                   }
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
                 edges{
                  cursor
                 node {
                   ... on User {
                     login
                     location
                     email
                     company
                     isHireable
                     url
                     websiteUrl
                     createdAt
                     id
                   }
                 }
               }
             }
    }`;

    return await new GithubApiV4().queryData(this.accessToken, query);
  }

  async getUserCountForLocation(location: string): Promise<number> {
    let query: string = `{
             search(query: "type:user location:${location}", type: USER) {
               userCount
             }
    }`;

    let data: string = await new GithubApiV4().queryData(
      this.accessToken,
      query
    );
    let jsonData = JSON.parse(data);

    return jsonData.data.search.userCount;
  }

  async getUserByLocation(location: string): Promise<IGithubUser[]> {
    //let githubUsers: IGithubUser[] = [];
    if (!this.githubUsers) this.githubUsers = [];
    let githubUser: IGithubUser;
    //Grab the endCursor from the first query
    let data: string = await this.firstQuery(location);
    let jsonData = JSON.parse(data);
    let pageInfo = jsonData.data.search.pageInfo;
    let endCursor: string = JSON.stringify(pageInfo.endCursor);
    let hasNextPage: boolean = pageInfo.hasNextPage;

    for (let edge of jsonData.data.search.edges) {
      githubUser = edge.node;
      githubUser.cursor = edge.cursor;
      this.githubUsers.push(githubUser);
    }

    //Use endCursor in subsequent queries to retrieve more users
    while (hasNextPage) {
      let nextData: string = await this.getData(location, endCursor);
      jsonData = JSON.parse(nextData);
      pageInfo = jsonData.data.search.pageInfo;
      endCursor = JSON.stringify(pageInfo.endCursor);
      hasNextPage = pageInfo.hasNextPage;
      data += nextData;
      for (let edge of jsonData.data.search.edges) {
        githubUser = edge.node;
        githubUser.cursor = edge.cursor;
        this.githubUsers.push(githubUser);
      }
    }

    return await this.continueGettingUsers(
      jsonData.data.search.edges[jsonData.data.search.edges.length - 1].node
        .createdAt,
      location
    );
  }

  async continueGettingUsers(
    lastCreatedAt: string,
    location: string
  ): Promise<IGithubUser[]> {
    let githubUser: IGithubUser;
    let jsonData = null; //First loop use lastCreatedAt passed in
    let failsafeCounter = 0;

    while (1) {
      if (jsonData) {
        lastCreatedAt =
          jsonData.data.search.edges[jsonData.data.search.edges.length - 1].node
            .createdAt;
      }
      let nextData: string = await this.getDataBefore(location, lastCreatedAt);
      jsonData = JSON.parse(nextData);
      let pageInfo = jsonData.data.search.pageInfo;
      let endCursor = JSON.stringify(pageInfo.endCursor);
      let hasNextPage = pageInfo.hasNextPage;
      for (let edge of jsonData.data.search.edges) {
        githubUser = edge.node;
        githubUser.cursor = edge.cursor;
        this.githubUsers.push(githubUser);
      }

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
        for (let edge of jsonData.data.search.edges) {
          githubUser = edge.node;
          githubUser.cursor = edge.cursor;
          this.githubUsers.push(githubUser);
        }
      }
      failsafeCounter++;
      if (failsafeCounter > 10000000000) break;
    }
    return this.githubUsers;
  }
}
