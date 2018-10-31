import fetch from "node-fetch";
const logger = require('../../logger.js');

export class TokenRetrieval {

    async getToken(url: string, body: string) {

        logger.info({
            class: "TokenRetrieval",
            method: "getToken",
            action: "Getting the Access Token from API",
            params: {url, body}
        }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

        console.log(`${url + body}`);

        return await fetch(`${url + body}`, {
            method: 'POST'
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
