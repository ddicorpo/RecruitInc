import fetch from 'node-fetch';
var logger = require('../../logger.js');

export class StackOverflowAPI {
    public queryProfileData(userId: string, query: string) : string {
        logger.info({ class: "StackOverflowAPI", method: "queryProfileData",
         action: "Query StackOverFlow API for a user Profile", params: { userId } }, 
         { timestamp: (new Date()).toLocaleTimeString(), processID: process.pid });
    
        var fetchUrl = 'https://api.stackexchange.com/2.2/users/' + userId +'?order=desc&sort=reputation&site=stackoverflow'
        return fetch(fetchUrl, {
            method: 'GET',
            body: JSON.stringify({ query }),
        }).then(response => response.text())
            .then(body => {
                logger.info({ class: "StackOverflowAPI", method: "queryProfileData", 
                    action: "Result from StackOverflowAPI", value: body },
                 { timestamp: (new Date()).toLocaleTimeString(), processID: process.pid });

                console.log("Successful Query");
                return body;

            })
            .catch(error => {
                logger.error({ class: "StackOverflowAPI", method: "queryData", 
                    action: "Error from StackOverflowAPI", value: error }, 
                { timestamp: (new Date()).toLocaleTimeString(), processID: process.pid });

                console.error(error);
                return error;
            });
    }    
}

//this.constructor.name.toString()