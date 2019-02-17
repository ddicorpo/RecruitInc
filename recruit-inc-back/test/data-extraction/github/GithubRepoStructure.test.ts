import { expect } from 'chai';
import { describe, it } from 'mocha';
import { GithubRepoStructure } from '../../../src/data-extraction/github/githubRepoStructure';
import { IGithubUser } from '../../../src/data-extraction/github/api-entities/IGithubUser';

const nock = require('nock');
let test: GithubRepoStructure = new GithubRepoStructure();
let user: IGithubUser = { login: 'MewtR', url: '', createdAt: '' };

const treeShaResponse = require('./treeShaResponse.js');

describe("Get a repository's root tree hash", () => {
  beforeEach(() => {
    //mocking the API
    nock('https://api.github.com')
      .post('/graphql')
      .reply(200, treeShaResponse);
  });

  it("Gets a repository's root hash", () => {
    return test
      .getTreeSha('AyoubeAkaouch', 'MinistocksRework')
      .then(response => {
        console.log("response: ", response);
        expect(response).to.be.a('string');

        //response = JSON.parse(response);
        console.log(response);
        //expect(response['data']['repository']['object']['oid']).to.equal( '63eb39fb316577353412a5c8a60f0693316edb14');
        expect(response).to.equal('63eb39fb316577353412a5c8a60f0693316edb14');
      });
  });
});
