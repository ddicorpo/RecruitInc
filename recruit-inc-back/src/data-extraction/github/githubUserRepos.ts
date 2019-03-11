import { GithubApiV4 } from './githubApiV4';
import { IGithubUser } from './api-entities/IGithubUser';
import { Logger } from '../../Logger';
import { IGithubProjectInput } from '../../matching-algo/data-model/input-model/IGithubProjectInput';
import { GithubUserCommits } from './githubUserCommits';

export class GithubUserRepos {
  private readonly accessToken: string;
  private logger;

  public constructor(
    accessToken: string = process.env.GITHUB_DEFAULT_AUTH_TOKEN,
    logger?: Logger
  ) {
    this.accessToken = accessToken;
    if (logger) {
      this.logger = logger;
    } else {
      this.logger = new Logger();
    }
  }

  async firstQuery(username: string): Promise<string> {
    let query: string = `query {
              user(login: "${username}"){
                repositories(first: 100, orderBy: {field: CREATED_AT, direction: DESC} ){
                  pageInfo{
                    hasNextPage
                    endCursor
                  }
              		nodes{
                        name
                        url
              		    owner{
                            login
                        }
                    }
                }
              }
            }  `;

    return await new GithubApiV4().queryData(this.accessToken, query);
  }

  async getDataAfterCursor(
    username: string,
    endCursor: string
  ): Promise<string> {
    let query: string = `query {
              user(login: "${username}"){
                repositories(first: 100, orderBy: {field: CREATED_AT, direction: DESC}, after: ${endCursor} ){
                  pageInfo{
                    hasNextPage
                    endCursor
                  }
              		nodes{
                        name
                        url
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
    let githubUserCommits: GithubUserCommits = new GithubUserCommits();
    let data: string = '';
    let jsonData;
    try {
      data = await this.firstQuery(user.login);
      jsonData = JSON.parse(data);
      if (jsonData.data == null || jsonData.data.user == null)
        throw new TypeError('The user you are trying to query does not exist');
    } catch (error) {
      this.logger.error({
        class: 'GithubUserRepos',
        method: 'getUserRepos',
        action:
          'Error while trying to obtain a list of repos from a given user. (Initial Query)',
        params: {},
        value: error.toString(),
      });
      return user;
    }
    let pageInfo = jsonData.data.user.repositories.pageInfo;
    let hasNextPage = pageInfo.hasNextPage;
    let endCursor: string = JSON.stringify(pageInfo.endCursor);
    let repositories: {
      name: string;
      url: string;
      owner: { login: string };
      commitCount: number;
    }[] = [];
    repositories = jsonData.data.user.repositories.nodes;
    repositories = await this.addCommitCount(repositories, user.id);
    user.dataEntry = {
      projectInputs: repositories
        .filter(repository => {
          return repository.commitCount !== 0;
        })
        .map(repository => {
          return {
            projectName: repository.name,
            owner: repository.owner.login,
            url: repository.url,
            applicantCommits: [],
            projectStructure: [],
            downloadedSourceFile: [],
          };
        }),
    };
    while (hasNextPage) {
      let nextData: string = '';
      try {
        nextData = await this.getDataAfterCursor(user.login, endCursor);
        jsonData = JSON.parse(nextData);
        if (jsonData.data == null || jsonData.data.user == null)
          throw new Error(
            "Either you reached the api's limit or the response was uncorrectly formatted."
          );
        pageInfo = jsonData.data.user.repositories.pageInfo;
        endCursor = JSON.stringify(pageInfo.endCursor);
        hasNextPage = pageInfo.hasNextPage;
        repositories = jsonData.data.user.repositories.nodes;
        repositories = await this.addCommitCount(repositories, user.id);
        user.dataEntry.projectInputs = user.dataEntry.projectInputs.concat(
          repositories
            .filter(repository => {
              return repository.commitCount !== 0;
            })
            .map(repository => {
              return {
                projectName: repository.name,
                owner: repository.owner.login,
                url: repository.url,
                applicantCommits: [],
                projectStructure: [],
                downloadedSourceFile: [],
              };
            })
        );
        data += nextData;
      } catch (error) {
        this.logger.error({
          class: 'GithubUserRepos',
          method: 'getUserRepos',
          action:
            'Error while trying to obtain a list of repos from a given user.(Subsequent Queries with endCursor)',
          params: {},
          value: error.toString(),
        });
        return user;
      }
    }

    return user;
  }

  async addCommitCount(
    repositories: {
      name: string;
      url: string;
      owner: { login: string };
      commitCount: number;
    }[],
    userId
  ): Promise<
    {
      name: string;
      url: string;
      owner: { login: string };
      commitCount: number;
    }[]
  > {
    let githubUserCommits: GithubUserCommits = new GithubUserCommits();
    for (let repository of repositories) {
      let count: number = await githubUserCommits.getCommitCount(
        repository.name,
        repository.owner.login,
        userId
      );
      repository.commitCount = count; //repository with no commits for user in question
    }
    return repositories;
  }

  async getRepos(user: IGithubUser): Promise<IGithubProjectInput[]> {
    let data: string = '';
    let projectInputs: IGithubProjectInput[];
    let jsonData;
    try {
      data = await this.firstQuery(user.login);
      jsonData = JSON.parse(data);
      if (jsonData.data == null || jsonData.data.user == null)
        throw new TypeError('The user you are trying to query does not exist');
    } catch (error) {
      this.logger.error({
        class: 'GithubUserRepos',
        method: 'getUserRepos',
        action:
          'Error while trying to obtain a list of repos from a given user. (Initial Query)',
        params: {},
        value: error.toString(),
      });
      if (
        error.toString().includes('API rate limit exceeded') &&
        !error.toString().includes('data')
      ) {
        throw error;
      }
      return projectInputs;
    }
    let pageInfo = jsonData.data.user.repositories.pageInfo;
    let hasNextPage = pageInfo.hasNextPage;
    let endCursor: string = JSON.stringify(pageInfo.endCursor);
    let repositories: {
      name: string;
      url: string;
      owner: { login: string };
      commitCount: number;
    }[] = [];
    repositories = jsonData.data.user.repositories.nodes;
    repositories = await this.addCommitCount(repositories, user.id);
    projectInputs = repositories
      .filter(repository => {
        return repository.commitCount !== 0;
      })
      .map(repository => {
        return {
          projectName: repository.name,
          owner: repository.owner.login,
          url: repository.url,
          applicantCommits: [],
          projectStructure: [],
          downloadedSourceFile: [],
        };
      });

    while (hasNextPage) {
      let nextData: string = '';
      try {
        nextData = await this.getDataAfterCursor(user.login, endCursor);
        jsonData = JSON.parse(nextData);
        if (jsonData.data == null || jsonData.data.user == null)
          throw new Error(
            "Either you reached the api's limit or the response was uncorrectly formatted."
          );
        pageInfo = jsonData.data.user.repositories.pageInfo;
        endCursor = JSON.stringify(pageInfo.endCursor);
        hasNextPage = pageInfo.hasNextPage;
        repositories = jsonData.data.user.repositories.nodes;
        repositories = await this.addCommitCount(repositories, user.id);
        projectInputs = projectInputs.concat(
          repositories
            .filter(repository => {
              return repository.commitCount !== 0;
            })
            .map(repository => {
              if (repository)
                return {
                  projectName: repository.name,
                  owner: repository.owner.login,
                  url: repository.url,
                  applicantCommits: [],
                  projectStructure: [],
                  downloadedSourceFile: [],
                };
            })
        );
        data += nextData;
      } catch (error) {
        this.logger.error({
          class: 'GithubUserRepos',
          method: 'getUserRepos',
          action:
            'Error while trying to obtain a list of repos from a given user.(Subsequent Queries with endCursor)',
          params: {},
          value: error.toString(),
        });
        if (
          error.toString().includes('API rate limit exceeded') &&
          !error.toString().includes('data')
        ) {
          throw error;
        }
        return projectInputs;
      }
    }

    return projectInputs;
  }
}
