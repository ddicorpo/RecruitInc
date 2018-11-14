import fetch from 'node-fetch';
import { Logger } from '../../Logger';

const logger = new Logger();
const url: string = 'https://github.com/login/oauth/access_token';
const client_id: string = '1908c6dc58ef2187341f';
const client_secret: string = '6bfae547289c1d3da3fa37df655d4aa02502b9ad';

export class GithubToken {
  public static buildParam(code: string) {
    return `${url +
      '?client_id=' +
      client_id +
      '&client_secret=' +
      client_secret +
      '&code=' +
      code}`;
  }

  async getToken(code: string) {
    logger.info({
      class: 'GithubToken',
      method: 'getToken',
      action: 'Getting the Access Token from Github API',
      params: { code },
    });

    let urlWithParameters: string = GithubToken.buildParam(code);
    return await fetch(`${urlWithParameters}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    })
      .then(response => response.text())
      .then(body => {
        logger.info({
          class: 'GithubToken',
          method: 'getToken',
          action: 'Result from trying to retrieve token',
          params: {},
          value: body,
        });
        return body;
      })
      .catch(error => {
        logger.info({
          class: 'GithubToken',
          method: 'getToken',
          action: 'ERROR from trying to retrieve token',
          params: {},
          value: error,
        });
        return error;
      });
  }
}
