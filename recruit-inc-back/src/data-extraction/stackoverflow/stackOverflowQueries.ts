import { StackOverflowAPI } from './stackOverflowAPI';

export { StackOverflowAPI } from './stackOverflowAPI'

export class StackOverflowQueries {

    async obtainProfileData(userId: string): Promise<string>{
        let query : string = ``;
        return await new StackOverflowAPI().queryProfileData(userId, query)
    }

}