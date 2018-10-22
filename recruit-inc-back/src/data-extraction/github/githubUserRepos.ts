import { GithubApiV4} from "./githubApiV4";
import {IGithubUser} from "./api-entities/IGithubUser"

export class GithubUserRepos {
    private readonly accessToken: string;
    
    public constructor(accessToken: string = "37780cb5a0cd8bbedda4c9537ebf348a6e402baf" ) {
      this.accessToken = accessToken;
  }

    async firstQuery(username: string): Promise<string> {
        let query : string =
            `query {
              user(login: "${username}"){
                repositories(first: 100, orderBy: {field: CREATED_AT, direction: DESC} ){
                  pageInfo{
                    hasNextPage
                    endCursor
                  }
              		nodes{
                        name
              		    owner{
                            login
                        }
                    }
                }
              }
            }  `;

        return await new GithubApiV4().queryData(this.accessToken, query);
    }

    async getDataAfterCursor(username: string, endCursor: string): Promise<string> {
        let query : string =
            `query {
              user(login: "${username}"){
                repositories(first: 100, orderBy: {field: CREATED_AT, direction: DESC}, after: ${endCursor} ){
                  pageInfo{
                    hasNextPage
                    endCursor
                  }
              		nodes{
                        name
              		    owner{
                            login
                        }
                    }
                }
              }
            }  `;

        return await new GithubApiV4().queryData(this.accessToken, query);
    }

    //The two queries above are sufficient to get all repos from a given user (including the repos where he/she has contributed but is not the user)
    //No need to use the createdAt variable 
    async getUserRepos(user: IGithubUser): Promise<IGithubUser> {

        let data: string = "";
        let jsonData;
        try{
        data = await this.firstQuery(user.login);
        jsonData = JSON.parse(data);
        if ( jsonData.data == null ||jsonData.data.user == null)
            throw new TypeError('The user you are trying to query does not exist');
        }catch(e){
         console.log(e);
         return user;
        }
        let pageInfo = jsonData.data.user.repositories.pageInfo;
        let hasNextPage = pageInfo.hasNextPage;
        let endCursor : string = JSON.stringify(pageInfo.endCursor);
        user.repositories = jsonData.data.user.repositories.nodes;
            
        while(hasNextPage){
          let nextData : string = "";
          try{
          nextData = await this.getDataAfterCursor(user.login, endCursor);
          jsonData = JSON.parse(nextData);
          if ( jsonData.data == null || jsonData.data.user == null)
            throw new Error('Something went wrong');
          pageInfo = jsonData.data.user.repositories.pageInfo;
          endCursor = JSON.stringify(pageInfo.endCursor);
          hasNextPage = pageInfo.hasNextPage;
          user.repositories += jsonData.data.user.repositories.nodes;
          data+=nextData;
          }catch(e){
           console.log(e);
           return user;
          }
        }

        return user;
    }
}
