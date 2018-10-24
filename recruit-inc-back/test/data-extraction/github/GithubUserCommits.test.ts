import { expect} from 'chai';
import { describe, it} from 'mocha';
import {GithubUserCommits} from "../../../src/data-extraction/github/githubUserCommits";
import {IGithubUser} from "../../../src/data-extraction/github/api-entities/IGithubUser";


const nock = require('nock');
let test : GithubUserCommits = new GithubUserCommits();
//let user : IGithubUser = {login: "MewtR", url: "", createdAt: ""};

  const GithubUserCommitsRetrieval = require('./GithubUserCommits.js');

  describe.only('Get commits from a user in a github repo', () => {
    beforeEach(() => {
      //mocking the API
        nock('https://api.github.com')
        .post('/graphql')
        .reply(200, GithubUserCommitsRetrieval);
    });

    it('Gets user commit hash', () => {
      return test.GetCommitsSpecificToUser('MinistocksRework', 'AyoubeAkaouch', 'mohamed_2_27@hotmail.com')
        .then(response => {

        expect(response).to.be.a('string');

        response = JSON.parse(response);
        console.log(response);
        expect(response["node"]["oid"]).to.equal("eff56ed52a77dfb8020a7ab11468138c00a3284f");
        });
    });
  });
