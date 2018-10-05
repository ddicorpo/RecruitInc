import { expect} from 'chai';
import {Query} from "../../../src/data-extraction/github/query";
import {GithubUserInfo} from "../../../src/data-extraction/github/githubUserInfo";

let fakeToken : string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
let fakeUsername : string = "fakeUsername";
let fakeLocation: string = "montreal";
let fakeEndCusor: string = "Y3Vyc29yOjEwMDA="
let fakeLastCreatedAt: string = "2018-09-27"

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

describe('Test getData function with an endCursor', function () {
    it('should call the github V4 API', function () {

        let fakeQuery : GithubUserInfo = new GithubUserInfo();

        //when the get data is called
        fakeQuery.getData(fakeLocation,fakeEndCusor)
            .then(() =>
                //expect the github GraphQL api called
                expect(fetch("https://api.github.com/graphql"))
            );
    });
});

describe('Test getDataBefore function', function () {
    it('should call the github V4 API', function () {

        let fakeQuery : GithubUserInfo = new GithubUserInfo();

        //when the get data is called
        fakeQuery.getDataBefore(fakeLocation,fakeLastCreatedAt)
            .then(() =>
                //expect the github GraphQL api called
                expect(fetch("https://api.github.com/graphql"))
            );
    });
});

describe('Test getDataBeforeWithEndCursor function', function () {
    it('should call the github V4 API', function () {

        let fakeQuery : GithubUserInfo = new GithubUserInfo();

        //when the get data is called
        fakeQuery.getDataBeforeWithEndCursor(fakeLocation,fakeLastCreatedAt,fakeEndCusor)
            .then(() =>
                //expect the github GraphQL api called
                expect(fetch("https://api.github.com/graphql"))
            );
    });
});