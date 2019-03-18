import fetch from 'node-fetch';
import { Logger } from '../../Logger';

export class GithubApiV4 {
  public queryData(accessToken: string, query: string): string {
    const logger = new Logger();

    logger.info({
      class: 'GithubAPIV4',
      method: 'queryData',
      action: "Querying github's api",
      params: { accessToken, query },
    });
    return fetch('https://api.github.com/graphql', {
      method: 'POST',
      body: JSON.stringify({ query }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => response.text())
      .then(body => {
        logger.info({
          class: 'GithubAPIV4',
          method: 'queryData',
          action: "Result from github's api",
          params: {},
          value: body,
        });
        if (
          body.toString().includes('API rate limit exceeded') &&
          !body.toString().includes('data')
        ) {
          //Only throw error to calling function if it is due to rate-limit abuse
          console.log('Actually throwing the error v4', body.toString());
          throw body;
        }
        console.log(body);
        return body;
      })
      .catch(error => {
        console.log('Caught an error dawg v4: ', error.toString());
        logger.error({
          class: 'GithubAPIV4',
          method: 'queryData',
          action: "Error from github's api",
          params: {},
          value: error,
        });
        if (
          error.toString().includes('API rate limit exceeded') &&
          !error.toString().includes('data')
        ) {
          //Only throw error to calling function if it is due to rate-limit abuse
          console.log('Actually throwing the error v4', error.toString());
          throw error;
        }
        console.error(error);
        return error;
      });
  }
}
