import { expect} from 'chai';
import { describe, it} from 'mocha';
import {GithubRepoStructure} from "../../../src/data-extraction/github/githubRepoStructure";
import {IGithubUser} from "../../../src/data-extraction/github/api-entities/IGithubUser";


const nock = require('nock');
let test : GithubRepoStructure = new GithubRepoStructure();
let user : IGithubUser = {login: "MewtR", url: "", createdAt: ""};

  const githubRepositoryRoot = require('./repositoryRootResponse.js');

  describe('Get repository root', () => {
    beforeEach(() => {
      //mocking the API
        nock('https://api.github.com')
        .post('/graphql')
        .reply(200, githubRepositoryRoot);
    });

    it('Gets a repository\'s root files', () => {
      return test.query('AyoubeAkaouch', 'MinistocksRework')
        .then(response => {

        expect(response).to.be.a('string');

        response = JSON.parse(response);
        console.log(response);
        //18 files in repository root
        expect(response["data"]["repository"]["object"]["entries"].length).to.equal(18);
        //Check specific file
        //Some files might be trees (directories)
        expect(response["data"]["repository"]["object"]["entries"][17]["type"]).to.equal("tree");
        expect(response["data"]["repository"]["object"]["entries"][17]["name"]).to.equal("src");
        });
    });
  });
