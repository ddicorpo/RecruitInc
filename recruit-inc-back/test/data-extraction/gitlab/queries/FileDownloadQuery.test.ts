import { expect } from 'chai';
import { GitlabQueryExecutor } from '../../../../src/data-extraction/gitlab/query-executor/GitlabQueryExecutor';
import { FileDownloadQuery } from '../../../../src/data-extraction/gitlab/queries/FileDownloadQuery';

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

    fileDownloadQuery.buildQuery();
    let expected: string = fileDownloadQuery.getQuery();
    let actual: string =
      'https://gitlab.com/api/v4/projects/1234/repository/blobs/abcde/raw';
    expect(expected).to.equal(actual);
  });
});
