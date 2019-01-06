import fetch from 'node-fetch';
import { Logger } from '../../Logger';

const logger = new Logger();
const url: string = 'http://gitlab.com/oauth/token';
const client_id: string = process.env.GITLAB_CLIENT_ID;
const client_secret: string = process.env.GITLAB_CLIENT_SECRET;
const redirectUrl: string = process.env.GITLAB_REDIREC_URL;

export class GitlabToken {
  async getToken(code: string) {
    logger.info({
      class: 'GitlabToken',
      method: 'getToken',
      action: 'Getting the Access Token from Gitlab API',
      params: { code },
    });

    let params: string = `${'?client_id=' +
      client_id +
      '&client_secret=' +
      client_secret +
      '&code=' +
      code +
      '&grant_type=authorization_code&redirect_uri=' +
      redirectUrl}`;

    return await fetch(`${url + params}`, {
      method: 'POST',
    })
      .then(response => response.text())
      .then(body => {
        logger.info({
          class: 'GitlabToken',
          method: 'getToken',
          action: 'Result from trying to retrieve token',
          params: {},
          value: body,
        });
        return body;
      })
      .catch(error => {
        logger.info({
          class: 'GitlabToken',
          method: 'getToken',
          action: 'ERROR from trying to retrieve token',
          params: {},
          value: error,
        });
        return error;
      });
  }
}
