import { expect} from 'chai';
import {Query} from "../../../src/data-extraction/github/query";

describe('Test getData function', function () {
    it('should call the github V4 API', function () {
        let fakeToken : string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
        let fakeUsername : string = "fakeUsername";

        let fakeQuery : Query = new Query(fakeToken);

        //when the get data is called
        fakeQuery.getData(fakeUsername)
            .then(() =>
                //expect the github GraphQL api called
                expect(fetch("https://api.github.com/graphql"))
            );
    });
});