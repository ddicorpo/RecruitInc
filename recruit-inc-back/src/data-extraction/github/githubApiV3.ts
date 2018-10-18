import fetch from "node-fetch";
const logger = require('../../logger.js');

export class GithubApiV3 {


    public queryData(accessToken: string, query: string ) : string{
    
    logger.info({class: "GithubApiV3", method: "queryData", action: "Querying Github's api", params: {accessToken, query}}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

    return fetch(`https://api.github.com/repos/${owner}/${repo}/${commits}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    }).then(response => response.text())
        .then(body => {
            logger.info({class: "GithubApiV3", method: "queryData", action: "Result from Github's api", value: body}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
            console.log(body);
            return body;
        })
        .catch(error => {
            logger.error({class: "GithubApiV3", method: "queryData", action: "Error from Github's api", value: error}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
            return error;
        });





    }
}