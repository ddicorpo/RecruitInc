import { GithubApiV4 } from './githubApiV4';
import { IGithubUser } from './api-entities/IGithubUser';
import * as process from "process"

export class GithubUserInfo {
  private readonly accessToken: string;
  private githubUsers: IGithubUser[];

  public constructor(
    accessToken: string = process.env.GITHUB_DEFAULT_AUTH_TOKEN
  ) {
    this.accessToken = accessToken;
  }

  setGithubUsers(githubUsers: IGithubUser[]){
      this.githubUsers = githubUsers;
  }

  getGithubUsers(){
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
                   }
                 }
               }
             }
    }`;

    return await new GithubApiV4().queryData(this.accessToken, query);
  }

  async getUserByLocation(location: string): Promise<IGithubUser[]> {
    //let githubUsers: IGithubUser[] = [];
    if (!this.githubUsers)
        this.githubUsers = [];
    let githubUser: IGithubUser;
    //Grab the endCursor from the first query
    let data: string = await this.firstQuery(location);
    let jsonData = JSON.parse(data);
    let pageInfo = jsonData.data.search.pageInfo;
    let endCursor: string = JSON.stringify(pageInfo.endCursor);
    let hasNextPage: boolean = pageInfo.hasNextPage;

    for (let edge of jsonData.data.search.edges){
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
        for (let edge of jsonData.data.search.edges){
            githubUser = edge.node;
            githubUser.cursor = edge.cursor;
            this.githubUsers.push(githubUser);
        }
    }

    //Loop until a search where no users are returned
    //using the createdAt parameter to get new users
    //while (1) {
    //  let lastCreatedAt: string =
    //    jsonData.data.search.edges[jsonData.data.search.edges.length - 1].node.createdAt;
    //  let nextData: string = await this.getDataBefore(location, lastCreatedAt);
    //  jsonData = JSON.parse(nextData);
    //  pageInfo = jsonData.data.search.pageInfo;
    //  endCursor = JSON.stringify(pageInfo.endCursor);
    //  hasNextPage = pageInfo.hasNextPage;
    //  data += nextData;
    //    for (let edge of jsonData.data.search.edges){
    //        githubUser = edge.node;
    //        githubUser.cursor = edge.cursor;
    //        this.githubUsers.push(githubUser);
    //    }

    //  if (!hasNextPage) break;

    //  while (hasNextPage) {
    //    let nextData: string = await this.getDataBeforeWithEndCursor(
    //      location,
    //      lastCreatedAt,
    //      endCursor
    //    );
    //    jsonData = JSON.parse(nextData);
    //    pageInfo = jsonData.data.search.pageInfo;
    //    endCursor = JSON.stringify(pageInfo.endCursor);
    //    hasNextPage = pageInfo.hasNextPage;
    //    data += nextData;
    //    for (let edge of jsonData.data.search.edges){
    //        githubUser = edge.node;
    //        githubUser.cursor = edge.cursor;
    //        this.githubUsers.push(githubUser);
    //    }
    //  }
    //}
    //return this.githubUsers;
    return await this.continueGettingUsers(jsonData.data.search.edges[jsonData.data.search.edges.length - 1].node.createdAt, location)
  }

  async continueGettingUsers(lastCreatedAt: string, location: string): Promise<IGithubUser[]> {

    let githubUser: IGithubUser;
    let jsonData = null; //First loop use lastCreatedAt passed in

    while (1) {
      if (jsonData){
      lastCreatedAt = jsonData.data.search.edges[jsonData.data.search.edges.length - 1].node.createdAt;
      }
      let nextData: string = await this.getDataBefore(location, lastCreatedAt);
      jsonData = JSON.parse(nextData);
      let pageInfo = jsonData.data.search.pageInfo;
      let endCursor = JSON.stringify(pageInfo.endCursor);
      let hasNextPage = pageInfo.hasNextPage;
        for (let edge of jsonData.data.search.edges){
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
        for (let edge of jsonData.data.search.edges){
            githubUser = edge.node;
            githubUser.cursor = edge.cursor;
            this.githubUsers.push(githubUser);
        }
      }
    }
    return this.githubUsers;
  }

}

 let query: GithubUserInfo = new GithubUserInfo();


  process.on('message', async (msg) => {
    let githubUsers: IGithubUser[];
    if (msg === 'STOP')
        process.exit(0);
    if (msg instanceof Array){
    console.log('We\'re here boi!')
    //let githubUsersSoFar: IGithubUser[] = query.getGithubUsers()
    let githubUsersSoFar: IGithubUser[] = msg;
    query.setGithubUsers(msg);
    let lastUser: IGithubUser = githubUsersSoFar[githubUsersSoFar.length-1];
    console.log(lastUser);
    githubUsers = await query.continueGettingUsers(lastUser.createdAt, lastUser.location);
    process.send(query.getGithubUsers());
    }else{
    console.log(process.pid);
    console.log("HelloOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
    githubUsers = await query.getUserByLocation(msg);
    process.send(githubUsers);
    }
  });

  process.on('exit', (code) => {
    let githubUsers: IGithubUser[] = query.getGithubUsers();
    if(typeof process.send === 'function'){ //Removing this if causes error for 'npm run test'
    process.send(githubUsers);
    }
    console.log(process.argv0);
    console.log(process.pid);
    console.log("byeEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
  });

