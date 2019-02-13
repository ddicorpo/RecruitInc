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

        console.log(body);
        return body;
      })
      .catch(error => {
        logger.error({
          class: 'GithubAPIV4',
          method: 'queryData',
          action: "Error from github's api",
          params: {},
          value: error,
        });
      if (error.toString().includes("abuse detection mechanism")){ //Only throw error to calling function if it is due to rate-limit abuse
        throw error;
      }
        console.error(error);
        return error;
      });
  }
}
