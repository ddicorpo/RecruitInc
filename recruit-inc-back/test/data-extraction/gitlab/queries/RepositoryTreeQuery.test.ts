import { expect } from 'chai';
import { GitlabQueryExecutor } from '../../../../src/data-extraction/gitlab/query-executor/GitlabQueryExecutor';
import { RepositoryTreeQuery } from '../../../../src/data-extraction/gitlab/queries/RepositoryTreeQuery';
import { IGitlabRepositoryTree } from '../../../../src/data-extraction/gitlab/api-entities/IGitlabRepositoryTree';

describe('Repository tree query class', function() {
  it('should return the correct query after building it', function() {
    let projectId: number = 1234;
    let gitlabRepositoryTreeQueryExecutor = new GitlabQueryExecutor<
      IGitlabRepositoryTree[]
    >();
    let repositoryTree: RepositoryTreeQuery = new RepositoryTreeQuery(
      projectId,
      gitlabRepositoryTreeQueryExecutor
    );
    //pass a value of 1 to take only the first page and a token
    const accessToken: string = 'durhdwhfg456s4d35w';
    repositoryTree.buildQuery(1, accessToken);
    let expected: string = repositoryTree.getQuery();
    let actual: string =
      'https://gitlab.com/api/v4/projects/1234/repository/tree?recursive=true&per_page=100&page=1&private_token=durhdwhfg456s4d35w';
    expect(expected).to.equal(actual);
  });
});
