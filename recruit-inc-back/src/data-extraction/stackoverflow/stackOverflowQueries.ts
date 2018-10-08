import { StackOverflowAPI } from './stackOverflowAPI';
import { IStackOverFlowProfile } from './api-entities/IStackOverFlowProfile';
import { IStackOverFlowError } from './api-entities/IStackOverFlowError';
import { IStackOverFlowBadges } from './api-entities/IStackOverFlowBadges';
import { IStackOverFlowNetwork } from './api-entities/IStackOverFlowNetwork';

export class StackOverflowQueries {

    async obtainProfileData(userId: string): Promise<IStackOverFlowProfile | IStackOverFlowError> {
        return await new StackOverflowAPI().queryProfileData(userId)
    }
    async obtainBadgesData(userId: string): Promise<IStackOverFlowBadges | IStackOverFlowError> {
        return await new StackOverflowAPI().queryBadgesData(userId)
    }
    async obtainNetworkData(userId: string): Promise<IStackOverFlowNetwork | IStackOverFlowError> {
        return await new StackOverflowAPI().queryNetworkData(userId)
    }

}