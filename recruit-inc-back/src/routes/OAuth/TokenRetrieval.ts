import fetch from "node-fetch";
const logger = require('../../logger.js');

export class TokenRetrieval {

    async getToken(url: string, client_id: string , client_secret: string,  code: string) {

        logger.info({
            class: "TokenRetrieval",
            method: "getToken",
            action: "Getting the Access Token from API",
            params: {url}
        }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

        return await fetch(`${url}`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: {
                grant_type: 'authorization_code',
                client_id: client_id,
                client_secret: client_secret,
                code: code
            },
            json: true
        }).then(response => response.text())
            .then(body => {
                logger.info({
                    class: "TokenRetrieval",
                    method: "getToken",
                    action: "Result from trying to retrieve token",
                    value: body
                }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                return body;
            })
            .catch(error => {
                logger.info({
                    class: "TokenRetrieval",
                    method: "getToken",
                    action: "ERROR from trying to retrieve token",
                    value: error
                }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                return error;
            });
    }
}
