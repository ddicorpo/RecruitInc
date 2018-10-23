import fetch from "node-fetch";
const logger = require('../../logger.js');

export class GithubApiV3 {

    public queryUserCommits(accessToken: string, owner: string, repo: string, sha: string  ) : string{
        logger.info({class: "githubApiV3", method: "queryUserCommits", action: "Querying github's api", params: {owner, repo, sha}}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
        return fetch(`https://api.github.com/repos/${owner}/${repo}/commits/${sha}`, {
            method: 'GET',
            headers: {
                'Authorization': `token ${accessToken}`,
            },
        }).then(response => response.text())
            .then(body => {
                logger.info({class: "githubApiV3", method: "queryData", action: "Result from github's api", value: body}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                console.log(body);
                return body;
            })
            .catch(error => {
                logger.error({class: "githubApiV3", method: "queryData", action: "Error from github's api", value: error}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                return error;
            });
    }

    public getGitTree(accessToken: string, owner: string, repo: string, sha: string  ) : string{
        logger.info({class: "githubApiV3", method: "getGitTree", action: "Querying github's api", params: {owner, repo, sha}}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
        return fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${sha}?recursive=1`, {
            method: 'GET',
            headers: {
                'Authorization': `token ${accessToken}`,
            },
        }).then(response => response.text())
            .then(body => {
                logger.info({class: "githubApiV3", method: "getGitTree", action: "Result from github's api", value: body}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                console.log(body);
                return body;
            })
            .catch(error => {
                logger.error({class: "githubApiV3", method: "getGitTree", action: "Error from github's api", value: error}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                return error;
            });
    }
}
