import fetch from "node-fetch";
const logger = require('../../../src/logger.js');

export class GithubApiV4 {

    public queryData(accessToken: string, query: string ) : string{

        logger.info({class: "GithubAPIV4", method: "queryData", action: "Querying github's api", params: {accessToken, query}}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
        return fetch('https://api.github.com/graphql', {
            method: 'POST',
            body: JSON.stringify({query}),
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        }).then(response => response.text())
            .then(body => {
                logger.info({class: "GithubAPIV4", method: "queryData", action: "Result from github's api", value: body}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

                console.log(body);
                return body;
            })
            .catch(error => {
                logger.error({class: "GithubAPIV4", method: "queryData", action: "Error from github's api", value: error}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

                console.error(error);
                return error;
            });
    }
}
