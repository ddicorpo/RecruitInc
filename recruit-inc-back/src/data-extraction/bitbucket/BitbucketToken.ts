import fetch from 'node-fetch';
import { Logger } from '../../Logger';

const logger = new Logger();
const url: string = 'https://bitbucket.org/site/oauth2/access_token';
const client_id: string = 'thwTU3aUh8ZBQNXyXA';
const client_secret: string = 'QpHyd9z5PfxUSW4m9j46vtQccXLTDZvQ';

export class BitbucketToken {
  async getToken(code: string) {
    logger.info({
      class: 'BitbucketToken',
      method: 'getToken',
      action: 'Getting the Access Token from BitBucket API',
      params: { code },
    });

    let details = {
      client_id: client_id,
      client_secret: client_secret,
      code: code,
      grant_type: 'authorization_code',
    };
    let formBody: string[] = [];
    for (let property in details) {
      let encodedKey: string = encodeURIComponent(property);
      let encodedValue: string = encodeURIComponent(details[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    let body: string = formBody.join('&');

    return await fetch(`${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: body,
    })
      .then(response => response.text())
      .then(body => {
        logger.info({
          class: 'BitbucketToken',
          method: 'getToken',
          action: 'Result from trying to retrieve token',
          params: {},
          value: body,
        });
        return body;
      })
      .catch(error => {
        logger.info({
          class: 'BitbucketToken',
          method: 'getToken',
          action: 'ERROR from trying to retrieve token',
          params: {},
          value: error,
        });
        return error;
      });
  }
}
