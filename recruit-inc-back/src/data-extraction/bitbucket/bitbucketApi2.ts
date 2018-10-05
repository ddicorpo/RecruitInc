import fetch from "node-fetch";
const logger = require('../../logger.js');

export class BitbucketApi2 {

    public constructor(){}

    public queryUserInfo(accessToken: string, user: string ) : string{
        logger.info({class: "bitbucketApi2", method: "queryData", action: "Querying bitbucket's api", params: {accessToken, user}}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
        return fetch(`https://api.bitbucket.org/2.0/users/${user}/repositories`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        }).then(response => response.text())
            .then(body => {
                logger.info({class: "bitbucketApi2", method: "queryData", action: "Result from bitbucket's api", value: body}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                console.log(body);
                return body;
            })
            .catch(error => {
                logger.error({class: "bitbucketApi2", method: "queryData", action: "Error from bitbucket's api", value: error}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                return error;
            });
    }
}
