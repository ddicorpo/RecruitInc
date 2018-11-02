import { expect} from 'chai';
import { describe, it} from 'mocha';
import {GithubUserRepos} from "../../../src/data-extraction/github/githubUserRepos";
import {IGithubUser} from "../../../src/data-extraction/github/api-entities/IGithubUser";


const nock = require('nock');
let test : GithubUserRepos = new GithubUserRepos();
let user : IGithubUser = {login: "MewtR", url: "", createdAt: ""};

  const githubRepositoryResponse = require('./githubRepositoryResponse.js');

  describe('Get User repositories', () => {
    beforeEach(() => {
      //mocking the API
        nock('https://api.github.com')
        .post('/graphql')
        .reply(200, githubRepositoryResponse);
    });

    it('Gets a user\'s repositories', () => {
      return test.firstQuery('MewtR')
        .then(response => {

        expect(response).to.be.a('string');

        response = JSON.parse(response);
        //User has 6 repositories
        expect(response["data"]["user"]["repositories"]["nodes"].length).to.equal(6);
        //Check a specific repository
        expect(response["data"]["user"]["repositories"]["nodes"][3]["name"]).to.equal('MinistocksRework');
        expect(response["data"]["user"]["repositories"]["nodes"][3]["owner"]["login"]).to.equal('AyoubeAkaouch');
        });
    });
  });

  describe('Populates an IGithubUser with his repositories', () => {
    beforeEach(() => {
    user = {login: "MewtR", url: "", createdAt: ""};
      //mocking the API
        nock('https://api.github.com')
        .post('/graphql')
        .reply(200, githubRepositoryResponse);
    });

    it('Populates an IGithubUser with his repositories', () => {
      return test.getUserRepos(user)
        .then(response => {

        //User has 6 repositories
        expect(user.dataEntry.projectInputs.length).to.equal(6);
        //Check a specific repository
        expect(user.dataEntry.projectInputs[3].projectName).to.equal('MinistocksRework');
        expect(user.dataEntry.projectInputs[3].owner).to.equal('AyoubeAkaouch');

        });
    });
  });
