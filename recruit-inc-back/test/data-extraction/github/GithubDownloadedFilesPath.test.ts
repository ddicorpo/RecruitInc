import { expect } from 'chai';
import { describe, it } from 'mocha';
import { GithubDownloadedFilesPath } from '../../../src/data-extraction/github/githubDownloadedFilesPath';
const fs = require('fs');
const nock = require('nock');
const downloadedFileResponse = require('./downloadedFileResponse.js');
const pathToFile = 'test/data-extraction/github/writeToFileTest.txt';
describe('Write to file', async () => {
  it('should write the contents of a downloaded file locally', () => {
    //Create file to write to
    fs.closeSync(fs.openSync(pathToFile, 'w'));
    let test = new GithubDownloadedFilesPath();

    //Write to file
    test.writeToFile('This is a test', pathToFile);
    let isFilePathValid: boolean = fs.existsSync(pathToFile);

    expect(isFilePathValid).to.be.true;

    //Delete file
    fs.unlinkSync(pathToFile);

    let exists2: boolean = fs.existsSync(pathToFile);
    expect(exists2).to.be.false;
  });
});

describe('Retrieve the contents of a file', () => {
  it('should download a file', async () => {
    nock('https://api.github.com')
      .get(
        '/repos/AyoubeAkaouch/MinistocksRework/contents/src/main/AndroidManifest.xml'
      )
      .reply(200, downloadedFileResponse);

    let test = new GithubDownloadedFilesPath();
    const result: {
      name: string;
      path: string;
      content: string;
    } = await test.downloadFile(
      'AyoubeAkaouch',
      'MinistocksRework',
      'src/main/AndroidManifest.xml'
    );
    expect(result.name).to.equal('AndroidManifest.xml');
    expect(result.path).to.equal('src/main/AndroidManifest.xml');
    let contents: string = fs.readFileSync(
      'test/data-extraction/github/AndroidManifest.xml',
      'utf8'
    );
    expect(result.content).to.equal(contents);
  });
});
