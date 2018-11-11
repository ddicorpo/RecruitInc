import { expect } from 'chai';
import { GitlabQueryExecutor } from '../../../../src/data-extraction/gitlab/query-executor/GitlabQueryExecutor';
import { FileDownloadQuery } from '../../../../src/data-extraction/gitlab/queries/FileDownloadQuery';

const fileSystem = require('fs');
const nock = require('nock');
const downloadFileResponse = require('../../../data-extraction/gitlab/downloadFileResponse');

describe('File download query class', function() {
  it('should return the correct query after building it', function() {
    let fileSha1: string = 'abcde';
    let projectId: number = 1234;
    let gitlabFileDownloadQueryExecutor = new GitlabQueryExecutor<any>();
    let fileDownloadQuery: FileDownloadQuery = new FileDownloadQuery(
      projectId,
      fileSha1,
      gitlabFileDownloadQueryExecutor
    );
    const accessToken: string = 'dsadfefd56fd';
    fileDownloadQuery.buildQuery(accessToken);
    let expected: string = fileDownloadQuery.getQuery();
    let actual: string =
      'https://gitlab.com/api/v4/projects/1234/repository/blobs/abcde/raw?&private_token=dsadfefd56fd';
    expect(expected).to.equal(actual);
  });
});

/* describe('Retrieving the contents of a file', () => {

    it('should download a file', async function() {

        nock('https://api.gitlab.com')
        //.get('/api/v4/projects/397775/repository/blobs/18f9b2da52f2d3185a676b0ce2c2639557560de3/raw?&private_token=dsadfefd56fd')
        .get('/api/v4/projects/*')

        .reply(200, downloadFileResponse)
        
        let gitlabFileDownloadExecutor = new GitlabQueryExecutor<any>();
        let fileDownloadQuery : FileDownloadQuery = new FileDownloadQuery(397775,"18f9b2da52f2d3185a676b0ce2c2639557560de3",gitlabFileDownloadExecutor);
        const accessToken: string = "dsadfefd56fd"
        fileDownloadQuery.buildQuery(accessToken); 
        let gitlabFileDownloadPromise: Promise<any> = fileDownloadQuery.executeDownloadQuery();
        let gitlabFileDownload_output: {content: string} = await gitlabFileDownloadPromise;
        let contents : string = fileSystem.readFileSync("./test/data-extraction/gitlab/generators.py", 'utf8');
        expect(gitlabFileDownload_output.content).to.equal(contents);

    });
}); */
