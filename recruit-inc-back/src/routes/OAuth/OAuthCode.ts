import { Request, Response } from "express";
const logger = require('../../logger.js');

var cors = require('cors');

export class OAuthCode {

    public routes(app): void {

        app.route('/api/OAuth/OAuthCode/:platform/:code')
            .get(cors(), async (request: Request, response: Response) => {
                logger.info({class: "OAuthCode", method: "routes", action: "/api/OAuth/OAuthCode/:code", value: {request, response}}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

                let code = request.params.code;
                let platform = request.params.platform;

                let returnResponse: string;

                switch (platform) {
                    case "github" : {


                        returnResponse = "Access Token received from Github using code: " + code;
                        break;
                    }
                    case "gitlab" : {

                        returnResponse = "Access Token received from Gitlab using code: " + code;
                        break;
                    }
                    case "bitbucket" : {

                        returnResponse = "Access Token received from BitBucket using code: " + code;
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