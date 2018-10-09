import { expect} from 'chai';
import { describe, it} from 'mocha';
import {GithubUserInfo} from "../../../src/data-extraction/github/githubUserInfo";


const nock = require('nock');
const firstQueryResponse = require('./firstQueryResponse.js');

let test : GithubUserInfo = new GithubUserInfo()

  describe('Get User information', () => {
    beforeEach(() => {
      //mocking the API
        nock('https://api.github.com')
        .post('/graphql')
        .reply(200,firstQueryResponse);
    });

    it('Get a user by username,location and url', () => {
      return test.firstQuery('Montreal')
        .then(response => {

        let fakeQuery : GithubUserInfo = new GithubUserInfo(fakeToken);
        expect(response).to.be.a('string');

        //9682 is the total number of accounts that are located in Montreal
        expect(JSON.parse(response).data.search.userCount).to.equal(9682);

        expect(JSON.parse(response).data.search.nodes[0].login).to.equal("Suzylxx")
        expect(JSON.parse(response).data.search.nodes[0].location).to.equal("Montreal")
        expect(JSON.parse(response).data.search.nodes[0].url).to.equal("https://github.com/Suzylxx")

        });
    });
  });

