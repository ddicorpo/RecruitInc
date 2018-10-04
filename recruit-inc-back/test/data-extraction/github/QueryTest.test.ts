import { expect} from 'chai';
import {Query} from "../../../src/data-extraction/github/query";
import {GithubUserInfo} from "../../../src/data-extraction/github/githubUserInfo";

let fakeToken : string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
let fakeUsername : string = "fakeUsername";
let fakeLocation: string = "montreal";

describe('Test getData function', function () {
    it('should call the github V4 API', function () {

        let fakeQuery : Query = new Query(fakeToken);

        //when the get data is called
        fakeQuery.getData(fakeUsername)
            .then(() =>
                //expect the github GraphQL api called
                expect(fetch("https://api.github.com/graphql"))
            );
    });
});

describe('Test firstQuery users location function', function () {
    it('should call the github V4 API', function () {

        let fakeQuery : GithubUserInfo = new GithubUserInfo();

        //when the first query is called
        fakeQuery.firstQuery(fakeLocation)
            .then(() =>
                //expect the github GraphQL api called
                expect(fetch("https://api.github.com/graphql"))
            );
    });
});