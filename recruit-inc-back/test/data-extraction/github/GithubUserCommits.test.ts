import { expect} from 'chai';
import { describe, it} from 'mocha';
import {GithubUserCommits} from "../../../src/data-extraction/github/githubUserCommits";
import {IGithubUser} from "../../../src/data-extraction/github/api-entities/IGithubUser";


const nock = require('nock');
let test : GithubUserCommits = new GithubUserCommits();
//let user : IGithubUser = {login: "MewtR", url: "", createdAt: ""};

  const GithubUserCommitsRetrieval = require('./GithubUserCommits.js');
  const FilesAffectedByCommit = require('./filesAffectedByCommit.js');

  describe('Get commits from a user in a github repo', () => {
    beforeEach(() => {
      //mocking the API
        nock('https://api.github.com')
        .post('/graphql')
        .reply(200, GithubUserCommitsRetrieval);
    });

    it('Gets user commit hash', () => {
      return test.GetCommitsSpecificToUser('MinistocksRework', 'AyoubeAkaouch', 'MDQ6VXNlcjI1MjUyMTIz')
        .then(response => {

        expect(response).to.be.a('string');

        response = JSON.parse(response);
        console.log(response);
        expect(response["node"]["oid"]).to.equal("eff56ed52a77dfb8020a7ab11468138c00a3284f");
        });
    });
  });

  describe('Get files affected by a given commit', () => {

    it('should return the file path as well as the lines added and deleted of the files affected by a commit', async function() {

        nock('https://api.github.com')
        .get('/repos/AyoubeAkaouch/MinistocksRework/commits/950e3b390cc8f569183cfbb5ec924537b083c191')
        .reply(200, FilesAffectedByCommit)

        let test = new GithubUserCommits();
        let result : {filePath: string, lineAdded: number, lineDeleted: number}[] = await test.getFilesAffectedByCommit('AyoubeAkaouch', 'MinistocksRework', '950e3b390cc8f569183cfbb5ec924537b083c191');

        //This commit affected 8 files
        expect(result.length).to.equal(8);

        //Check a specific file
        expect(result[7].filePath).to.equal('src/test/java/nitezh/ministock/mocks/MockWidget.java');
        expect(result[7].lineAdded).to.equal(5);
        expect(result[7].lineDeleted).to.equal(0);
    });
  });
