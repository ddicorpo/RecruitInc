import { expect} from 'chai';
import { describe, it} from 'mocha';
import {GithubDownloadedFilesPath} from "../../../src/data-extraction/github/githubDownloadedFilesPath";
import {IGithubUser} from "../../../src/data-extraction/github/api-entities/IGithubUser";


const fs = require('fs');
const nock = require('nock');
const downloadedFileResponse = require('./downloadedFileResponse.js');

  describe('Write to file', () => {

    it('should write the contents of a downloaded file locally', function() {
 
        //Create file to write to
        fs.closeSync(fs.openSync("test/data-extraction/github/writeToFileTest.txt", 'w'));
        let test = new GithubDownloadedFilesPath();

        //Write to file
        test.writeToFile("This is a test", "test/data-extraction/github/writeToFileTest.txt" );
        let exists : boolean = fs.existsSync("test/data-extraction/github/writeToFileTest.txt");

        expect(exists).to.be.true;

        //Delete file
        fs.unlinkSync("test/data-extraction/github/writeToFileTest.txt");

        let exists2 : boolean = fs.existsSync("test/data-extraction/github/writeToFileTest.txt");
        expect(exists2).to.be.false;
    });
  });

  describe('Retrieve the contents of a file', () => {

    it('should download a file', async function() {

        nock('https://api.github.com')
        .get('/repos/AyoubeAkaouch/MinistocksRework/contents/src/main/AndroidManifest.xml')
        .reply(200, downloadedFileResponse)

        let test = new GithubDownloadedFilesPath();
        let result : {name: string, path: string, content: string} = await test.downloadFile('AyoubeAkaouch', 'MinistocksRework', 'src/main/AndroidManifest.xml');
        expect(result.name).to.equal('AndroidManifest.xml');
        expect(result.path).to.equal('src/main/AndroidManifest.xml');
        let contents : string = fs.readFileSync('test/data-extraction/github/AndroidManifest.xml', 'utf8');
        expect(result.content).to.equal(contents);

    });
  });
