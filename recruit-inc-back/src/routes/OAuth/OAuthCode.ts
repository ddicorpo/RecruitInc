import { Request, Response } from "express";
import {TokenRetrieval} from "./TokenRetrieval";

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

                //const OAuthInfo = fs.readFileSync("OAuthInfo.json");

                let data: TokenRetrieval = new TokenRetrieval();
                switch (platform) {
                    case "github" : {
                        let url = "https://github.com/login/oauth/access_token";
                        let client_id = "1908c6dc58ef2187341f";
                        let client_secret = "6bfae547289c1d3da3fa37df655d4aa02502b9ad";
                        let body = `${"?client_id=" + client_id + "&client_secret=" + client_secret + "&code=" + code}`;

                        let token: string = await data.getToken(url , body);
                        returnResponse = "Access Token received from Github using code: " + code + " -> token: " + token;
                        break;
                    }
                    case "gitlab" : {
                        let url = "http://gitlab.com/oauth/token";
                        let client_id = "cf78ad0e83e8c8f5e4cc8b60ef0250e1d1a299cd9f3ec91ec9d54399eb52e102";
                        let client_secret = "a692c84ab5d9b94e1a67294c2360f00195d5200195a2cc1b9c3d537d11cc2c66";
                        let body = `${"?client_id=" + client_id + "&client_secret=" + client_secret + "&code=" + code}`;

                        let token: string = await data.getToken(url, body);
                        returnResponse = "Access Token received from Github using code: " + code + " -> token: " + token;
                        break;
                    }
                    case "bitbucket" : {
                        let url = "https://bitbucket.org/site/oauth2/access_token";
                        let client_id = "thwTU3aUh8ZBQNXyXA";
                        let client_secret = "QpHyd9z5PfxUSW4m9j46vtQccXLTDZvQ";
                        let body = `${"?client_id=" + client_id + "&client_secret=" + client_secret + "&code=" + code}`;

                        let token: string = await data.getToken(url , body);
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