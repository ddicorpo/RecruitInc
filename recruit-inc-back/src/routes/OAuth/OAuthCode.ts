import { Request, Response } from "express";
import {GithubToken} from "../../data-extraction/github/GithubToken";
import {BitbucketToken} from "../../data-extraction/bitbucket/BitbucketToken";
import {GitlabToken} from "../../data-extraction/gitlab/GitlabToken";

const logger = require('../../logger.js');

let cors = require('cors');

export class OAuthCode {

    public routes(app): void {

        app.route('/api/oauth/oauthcode/:platform/:code')
            .get(cors(), async (request: Request, response: Response) => {
                logger.info({
                    class: "OAuthCode",
                    method: "routes",
                    action: "/api/OAuth/OAuthCode/:code",
                    value: {request, response}
                }, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

                let code = request.params.code;
                let platform = request.params.platform;

                let returnResponse: string;
                switch (platform) {
                    case "github" : {
                        let token: string = await new GithubToken().getToken(code);
                        returnResponse = "Access Token received from Github using code: " + code + " -> token: " + token;
                        break;
                    }
                    case "gitlab" : {
                        let token: string = await new GitlabToken().getToken(code);
                        returnResponse = "Access Token received from Github using code: " + code + " -> token: " + token;
                        break;
                    }
                    case "bitbucket" : {
                        let token: string = await new BitbucketToken().getToken(code);
                        returnResponse = "Access Token received from Github using code: " + code + " -> token: " + token;
                        break;
                    }
                    default : {
                        returnResponse = "Invalid platform, no access Token received using code: " + code;
                        break;
                    }
                }
                response.status(200).send(returnResponse);
            });
    }
}