import fetch from 'node-fetch';
import { Logger } from '../../Logger';

const logger = new Logger();

export class GithubApiV3 {
  public queryUserCommits(
    accessToken: string,
    owner: string,
    repo: string,
    sha: string
  ): string {
    logger.info({
      class: 'githubApiV3',
      method: 'queryUserCommits',
      action: "Querying github's api",
      params: { owner, repo, sha },
    });
    return fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits/${sha}`,
      {
        method: 'GET',
        headers: {
          Authorization: `token ${accessToken}`,
        },
      }
    )
      .then(response => response.text())
      .then(body => {
        logger.info({
          class: 'githubApiV3',
          method: 'queryUserCommits',
          action: "Result from github's api",
          params: {},
          value: body,
        });
        if (
          body
            .toString()
            .includes('https://developer.github.com/v3/#rate-limiting') &&
          !body.toString().includes('sha')
        ) {
          //Only throw error to calling function if it is due to rate-limit abuse
          console.log('Actually throwing the error v3', body.toString());
          throw body;
        }
        console.log(body);
        return body;
      })
      .catch(error => {
        logger.error({
          class: 'githubApiV3',
          method: 'queryUserCommits',
          action: "Error from github's api",
          params: {},
          value: error,
        });
        if (error.toString().includes('rate-limiting')) {
          //Only throw error to calling function if it is due to rate-limit abuse
          throw error;
        }
        return error;
      });
  }

  public getGitTree(
    accessToken: string,
    owner: string,
    repo: string,
    sha: string
  ): string {
    logger.info({
      class: 'githubApiV3',
      method: 'getGitTree',
      action: "Querying github's api",
      params: { owner, repo, sha },
    });
    return fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${sha}?recursive=1`,
      {
        method: 'GET',
        headers: {
          Authorization: `token ${accessToken}`,
        },
      }
    )
      .then(response => response.text())
      .then(body => {
        logger.info({
          class: 'githubApiV3',
          method: 'getGitTree',
          action: "Result from github's api",
          params: {},
          value: body,
        });
        if (
          body
            .toString()
            .includes('https://developer.github.com/v3/#rate-limiting') &&
          !body.toString().includes('sha')
        ) {
          //Only throw error to calling function if it is due to rate-limit abuse
          throw body;
        }
        console.log(body);
        return body;
      })
      .catch(error => {
        logger.error({
          class: 'githubApiV3',
          method: 'getGitTree',
          action: "Error from github's api",
          params: {},
          value: error,
        });
        if (error.toString().includes('rate-limiting')) {
          throw error;
        }
        return error;
      });
  }

  public downloadFile(
    accessToken: string,
    owner: string,
    repo: string,
    path: string
  ): string {
    logger.info({
      class: 'githubApiV3',
      method: 'downloadFile',
      action: "Querying github's api",
      params: { owner, repo, path },
    });
    return fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: 'GET',
        headers: {
          Authorization: `token ${accessToken}`,
        },
      }
    )
      .then(response => response.text())
      .then(body => {
        logger.info({
          class: 'githubApiV3',
          method: 'downloadFile',
          action: "Result from github's api",
          params: {},
          value: body,
        });
        if (
          body
            .toString()
            .includes('https://developer.github.com/v3/#rate-limiting') &&
          !body.toString().includes('sha')
        ) {
          //Only throw error to calling function if it is due to rate-limit abuse
          throw body;
        }
        console.log(body);
        return body;
      })
      .catch(error => {
        logger.error({
          class: 'githubApiV3',
          method: 'downloadFile',
          action: "Error from github's api",
          params: {},
          value: error,
        });
        if (error.toString().includes('rate-limiting')) {
          throw error;
        }
        return error;
      });
  }
}
