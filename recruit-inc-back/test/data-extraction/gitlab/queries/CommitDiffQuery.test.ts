import { expect } from 'chai';
import { GitlabQueryExecutor } from '../../../../src/data-extraction/gitlab/query-executor/GitlabQueryExecutor';
import { IGitlabCommitDiff } from '../../../../src/data-extraction/gitlab/api-entities/IGitlabCommitDiff';
import { CommitDiffQuery } from '../../../../src/data-extraction/gitlab/queries/CommitDiffQuery';

describe('Commit diff query class', function() {
  it('should return the correct query after building it', function() {
    let commitSha1: string = 'abcde';
    let projectId: number = 1234;
    let gitlabCommitDiffQueryExecutor = new GitlabQueryExecutor<
      IGitlabCommitDiff[]
    >();
    let commitDiffQuery: CommitDiffQuery = new CommitDiffQuery(
      projectId,
      commitSha1,
      gitlabCommitDiffQueryExecutor
    );

    const accessToken: string = 'dsadfefd56fd';
    commitDiffQuery.buildQuery(accessToken);
    let expected: string = commitDiffQuery.getQuery();
    let actual: string =
      'https://gitlab.com/api/v4/projects/1234/repository/commits/abcde/diff&private_token=dsadfefd56fd';
    expect(expected).to.equal(actual);
  });
});
