import fetch from 'node-fetch';
import {IGitlabQueryExecutor} from "./IGitlabQueryExecutor";

var logger = require('../../../logger.js');

export class GitlabQueryExecutor<Response> implements IGitlabQueryExecutor<Response> {
    private baseGitlabApi = "https://gitlab.com/api/v4/";

    public async executeQuery(query: string) : Promise<Response>{

        logger.info({class: "GitlabQueryExecutor", method: "executeQuery", action: "Querying gitlab's api", params: {query}}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
        return await fetch(query, {
            method: 'GET',
        }).then(response => response.text())
            .then(body => {
                logger.info({class: "GitlabQueryExecutor", method: "executeQuery", action: "Result from gitlab's api", value: body}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

                console.log(body);
                return body;
            })
            .catch(error => {
                logger.error({class: "GitlabQueryExecutor", method: "executeQuery", action: "Error from gitlab's api", value: error}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

                console.error(error);
                return error;
            });
    }

    public getBaseGitlabApi(): string {
        return this.baseGitlabApi;
    };
}
