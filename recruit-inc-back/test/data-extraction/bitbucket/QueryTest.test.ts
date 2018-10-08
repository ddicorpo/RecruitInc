import { expect} from 'chai';
import {BitbucketUserInfo} from "../../../src/data-extraction/bitbucket/bitbucketUserInfo";

//queryUserInfo(accessToken: string, user: string )

let fakeToken : string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
let fakeUsername : string = "fakeUsername";

describe('Test queryUserInfo function', function () {
    it('should call the BitBucket address Successful with the username as parameter', function () {

        let fakeQuery : BitbucketUserInfo = new BitbucketUserInfo(fakeToken);

        fakeQuery.getUserData(fakeUsername)
            .then(() =>
                //expect the github GraphQL api called
                expect(fetch(`https://api.bitbucket.org/2.0/users/${fakeUsername}/repositories`))
            );
    });
});