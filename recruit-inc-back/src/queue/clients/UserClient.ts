import { IGithubClient } from './IGithubClient';
import { RequiredClientInformation } from '../RequiredClientInformation';


export class UserClient implements IGithubClient {
    private prospect: RequiredClientInformation;

    public constructor(propsect: RequiredClientInformation) {
        this.prospect = propsect;
    }

    async executeQuery() {

        //TODO: refactor the methods to query for users from a location string
        //TODO: Get users query and pass shit to the repo queue
        //TODO: Save to database
    }
}