import fetch from 'node-fetch';
var logger = require('../../logger.js');
let API_ROOT_URL: string = 'https://api.stackexchange.com/2.2/users/'
export class StackOverflowAPI {

    public queryProfileData(userId: string) : string {
        var preparedUrl = API_ROOT_URL + userId + '?order=desc&sort=reputation&site=stackoverflow'
        return this.queryUserData(userId, preparedUrl, 'queryProfileData' )
    }

    public queryBadgesData(userId: string): string{
        var preparedUrl = API_ROOT_URL + userId + '/badges?order=desc&sort=rank&site=stackoverflow'
        return this.queryUserData(userId, preparedUrl, 'queryBadgesData')
    }

    public queryNetworkData(userId: string): string{
        var preparedUrl = API_ROOT_URL + userId + '/network-activity'
        return this.queryUserData(userId, preparedUrl, 'queryNetworkData')
    }

    private queryUserData(userId:string, fetchUrl:string, methodInvok: string){
        logger.info({
            class: "StackOverflowAPI", method: methodInvok,
            action: "Query StackOverFlow API for a user Profile", params: { userId }
        },
            { timestamp: (new Date()).toLocaleTimeString(), processID: process.pid });
        return fetch(fetchUrl, {
            method: 'GET'
        }).then(response => response.text())
            .then(body => {
                logger.info({
                    class: "StackOverflowAPI", method: methodInvok,
                    action: "Result from StackOverflowAPI", value: body
                },
                    { timestamp: (new Date()).toLocaleTimeString(), processID: process.pid });

                console.log("...Successful Query...");
                return body;
            })
            .catch(error => {
                logger.error({
                    class: "StackOverflowAPI", method: methodInvok,
                    action: "Error from StackOverflowAPI", value: error
                },
                    { timestamp: (new Date()).toLocaleTimeString(), processID: process.pid });
                console.log("Error with the Query...")
                console.error(error);
                return error;
            });
    }
    
}