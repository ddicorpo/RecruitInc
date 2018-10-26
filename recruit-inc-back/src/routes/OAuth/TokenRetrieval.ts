import fetch from "node-fetch";
const logger = require('../../logger.js');

export class TokenRetrieval {

    public getToken(queryUrl : string) : string{

        logger.info({class: "TokenRetrieval", method: "getToken", action: "Getting the Access Token from API", params: {queryUrl}}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
        return fetch(`${queryUrl}`, {
            method: 'POST'
        }).then(response => response.text())
            .then(body => {
                logger.info({class: "TokenRetrieval", method: "getToken", action: "Result from trying to retrieve token", params: {queryUrl}}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                return body;
            })
            .catch(error => {
                logger.info({class: "TokenRetrieval", method: "getToken", action: "ERROR from trying to retrieve token", params: {queryUrl}}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                return error;
            });
    }
}
