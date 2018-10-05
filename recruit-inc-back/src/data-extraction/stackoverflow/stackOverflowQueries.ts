import { StackOverflowAPI } from './stackOverflowAPI';

export class StackOverflowQueries {

    async obtainProfileData(userId: string): Promise<string>{
        return await new StackOverflowAPI().queryProfileData(userId)
    }

}