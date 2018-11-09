import { expect } from 'chai';
import { GitlabQueryExecutor } from '../../../../src/data-extraction/gitlab/query-executor/GitlabQueryExecutor';
import { ProjectQuery } from '../../../../src/data-extraction/gitlab/queries/ProjectQuery';
import { IGitlabProject } from '../../../../src/data-extraction/gitlab/api-entities/IGitlabProject';

describe('Project query class', function() {
  it('should return the correct query after building it', function() {
    let userId: number = 1234;
    let gitlabProjectQueryExecutor = new GitlabQueryExecutor<
      IGitlabProject[]
    >();
    let projectQuery: ProjectQuery = new ProjectQuery(
      userId,
      gitlabProjectQueryExecutor
    );

    projectQuery.buildQuery();
    let expected: string = projectQuery.getQuery();
    let actual: string =
      'https://gitlab.com/api/v4/users/1234/projects?statistics=true';
    expect(expected).to.equal(actual);
  });
});
