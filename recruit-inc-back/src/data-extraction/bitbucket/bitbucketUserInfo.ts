import {BitbucketApi2} from "./bitbucketApi2";

export class BitbucketUserInfo {

    public constructor(){}

    static async getData(username: string): Promise<string> {
        return await new BitbucketApi2().queryData(username);
    }
}