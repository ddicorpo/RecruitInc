
import fetch from "node-fetch";
const logger = require('../../../src/logger.js');


const url: string = 'http://gitlab.com/oauth/token';
const client_id: string =
  'cf78ad0e83e8c8f5e4cc8b60ef0250e1d1a299cd9f3ec91ec9d54399eb52e102';
const client_secret: string =
  'a692c84ab5d9b94e1a67294c2360f00195d5200195a2cc1b9c3d537d11cc2c66';
const redirectUrl: string = 'http://localhost:3000/OAuth/gitlab';

export class GitlabToken {
  async getToken(code: string) {
    logger.info(
      {
        class: 'GitlabToken',
        method: 'getToken',
        action: 'Getting the Access Token from Gitlab API',
        params: { code },
      },
      { timestamp: new Date().toLocaleTimeString(), processID: process.pid }
    );

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
        logger.info(
          {
            class: 'GitlabToken',
            method: 'getToken',
            action: 'Result from trying to retrieve token',
            value: body,
          },
          { timestamp: new Date().toLocaleTimeString(), processID: process.pid }
        );
        return body;
      })
      .catch(error => {
        logger.info(
          {
            class: 'GitlabToken',
            method: 'getToken',
            action: 'ERROR from trying to retrieve token',
            value: error,
          },
          { timestamp: new Date().toLocaleTimeString(), processID: process.pid }
        );
        return error;
      });
  }
}
