import fetch from 'node-fetch';
import { INetwork } from './api-entities/INetwork';
import { IError } from './api-entities/IError';
import { IBadges } from './api-entities/IBadges';
import { IProfile } from './api-entities/IProfile';
var logger = require('../../logger.js');
const API_ROOT_URL: string = 'https://api.stackexchange.com/2.2/users/'
export class StackOverflowAPI {

    public queryProfileData(userId: string) : IProfile | IError {
        const preparedUrl : string = API_ROOT_URL + userId + '?order=desc&sort=reputation&site=stackoverflow'
        return this.queryUserData(userId, preparedUrl, "queryProfileData")
    }

    public queryBadgesData(userId: string): IBadges | IError{
        const preparedUrl : string = API_ROOT_URL + userId + '/badges?order=desc&sort=rank&site=stackoverflow'
        return this.queryUserData(userId, preparedUrl, "queryBadgeData")
    }

    public queryNetworkData(userId: string): INetwork | IError {
        const preparedUrl : string = API_ROOT_URL + userId + '/network-activity'
        return this.queryUserData(userId, preparedUrl, "queryNetworkData")
    }

    private queryUserData(userId:string, fetchUrl:string, methodInvok: string) : any{
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
                    action: "Query StackOverFlow API for a user Profile", params: { userId }
                },
                    { timestamp: (new Date()).toLocaleTimeString(), processID: process.pid });

                console.log("...Successful Query...");
                return JSON.parse(body);
            })
            .catch(error => {
                logger.error({
                    class: "StackOverflowAPI", method: methodInvok,
                    action: "Query StackOverFlow API for a user Profile", params: { userId }
                },
                    { timestamp: (new Date()).toLocaleTimeString(), processID: process.pid });
                console.log("Error with the Query...")
                console.error(error);
                return error;
            });
    }
    
}