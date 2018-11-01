import fetch from "node-fetch";
const logger = require('../../logger.js');

const url: string = "https://bitbucket.org/site/oauth2/access_token";
const client_id: string = "thwTU3aUh8ZBQNXyXA";
const client_secret: string = "QpHyd9z5PfxUSW4m9j46vtQccXLTDZvQ";

export class BitbucketToken {

    async getToken(code: string) {
        logger.info({
            class: "BitbucketToken",
            method: "getToken",
            action: "Getting the Access Token from BitBucket API",
            params: {code}
        }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

        let details = {
            client_id: client_id,
            client_secret: client_secret,
            code: code,
            grant_type: 'authorization_code'
        };
        let formBody = [];
        for (let property in details) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        let body = formBody.join("&");
        return await fetch(`${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: body
        }).then(response => response.text())
            .then(body => {
                logger.info({
                    class: "BitbucketToken",
                    method: "getToken",
                    action: "Result from trying to retrieve token",
                    value: body
                }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                return body;
            })
            .catch(error => {
                logger.info({
                    class: "BitbucketToken",
                    method: "getToken",
                    action: "ERROR from trying to retrieve token",
                    value: error
                }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                return error;
            });
    }
}
