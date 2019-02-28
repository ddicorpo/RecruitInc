import { expect } from 'chai';
import { describe, it } from 'mocha';
import { GithubDownloadedFilesPath } from '../../../src/data-extraction/github/githubDownloadedFilesPath';
import { ISourceFiles } from '../../../src/matching-algo/data-model/input-model/ISourceFiles';
const fs = require('fs');
const nock = require('nock');
const downloadedFileResponse = require('./downloadedFileResponse.js');
const pathToFile = 'test/data-extraction/github/writeToFileTest.txt';

describe('Retrieve the contents of a file', () => {
  it('should download a file', async () => {
    nock('https://api.github.com')
      .get(
        '/repos/AyoubeAkaouch/MinistocksRework/contents/src/main/AndroidManifest.xml'
      )
      .reply(200, downloadedFileResponse);

    let test = new GithubDownloadedFilesPath();
    const result: {
      filename: string;
      repoFilePath: string;
      fileContents: string;
    } = await test.downloadFile(
      'AyoubeAkaouch',
      'MinistocksRework',
      'src/main/AndroidManifest.xml'
    );
    expect(result.filename).to.equal('AndroidManifest.xml');
    expect(result.repoFilePath).to.equal('src/main/AndroidManifest.xml');
    let contents: string = fs.readFileSync(
      'test/data-extraction/github/AndroidManifest.xml',
      'utf8'
    );
    expect(result.fileContents).to.equal(contents);
  });
});
