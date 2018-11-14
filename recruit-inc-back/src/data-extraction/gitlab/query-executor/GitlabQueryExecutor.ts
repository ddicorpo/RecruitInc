import fetch from 'node-fetch';
import { IGitlabQueryExecutor } from './IGitlabQueryExecutor';
import { Logger } from '../../../Logger';

const logger = new Logger();

export class GitlabQueryExecutor<Response>
  implements IGitlabQueryExecutor<Response> {
  private baseGitlabApi = 'https://gitlab.com/api/v4/';

  public async executeQuery(query: string): Promise<Response> {
    logger.info({
      class: 'GitlabQueryExecutor',
      method: 'executeQuery',
      action: "Querying gitlab's api",
      params: { query },
    });
    return await fetch(query, {
      method: 'GET',
    })
      .then(response => response.text())
      .then(body => {
        logger.info({
          class: 'GitlabQueryExecutor',
          method: 'executeQuery',
          action: "Result from gitlab's api",
          params: {},
          value: body,
        });

        return JSON.parse(body);
      })
      .catch(error => {
        logger.error({
          class: 'GitlabQueryExecutor',
          method: 'executeQuery',
          action: "Error from gitlab's api",
          params: {},
          value: error,
        });

        return error;
      });
  }

  public async executeDownloadQuery(query: string): Promise<Response> {
    logger.info({
      class: 'GitlabQueryExecutor',
      method: 'executeQuery',
      action: "Querying gitlab's api",
      params: { query },
    });
    return await fetch(query, {
      method: 'GET',
    })
      .then(response => response.text())
      .then(body => {
        logger.info({
          class: 'GitlabQueryExecutor',
          method: 'executeQuery',
          action: "Result from gitlab's api",
          params: {},
          value: body,
        });

        return { content: body };
      })
      .catch(error => {
        logger.error({
          class: 'GitlabQueryExecutor',
          method: 'executeQuery',
          action: "Error from gitlab's api",
          params: {},
          value: error,
        });

        return error;
      });
  }

  public getBaseGitlabApi(): string {
    return this.baseGitlabApi;
  }
}
