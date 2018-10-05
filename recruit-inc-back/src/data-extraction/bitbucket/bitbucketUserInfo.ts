import {BitbucketApi2} from "./bitbucketApi2";

export class BitbucketUserInfo {
    private readonly accessToken: string;

    public constructor(accessToken: string) {
        this.accessToken = accessToken;
    }

    public async getData(username: string): Promise<string> {
        return await new BitbucketApi2().queryUserInfo(this.accessToken, username);
    }
}