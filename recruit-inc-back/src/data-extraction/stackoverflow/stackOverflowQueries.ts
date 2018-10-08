import { StackOverflowAPI } from './stackOverflowAPI';
import { IProfile } from './api-entities/IProfile';
import { IError } from './api-entities/IError';
import { IBadges } from './api-entities/IBadges';
import { INetwork } from './api-entities/INetwork';

export class StackOverflowQueries {

    async obtainProfileData(userId: string): Promise<IProfile | IError> {
        return await new StackOverflowAPI().queryProfileData(userId)
    }
    async obtainBadgesData(userId: string): Promise<IBadges | IError> {
        return await new StackOverflowAPI().queryBadgesData(userId)
    }
    async obtainNetworkData(userId: string): Promise<INetwork | IError> {
        return await new StackOverflowAPI().queryNetworkData(userId)
    }

}