import { expect} from 'chai';
import {GitlabQueryExecutor} from "../../../../src/data-extraction/gitlab/query-executor/GitlabQueryExecutor";
import {IGitlabCommit} from "../../../../src/data-extraction/gitlab/api-entities/IGitlabCommit";
import {CommitQuery} from "../../../../src/data-extraction/gitlab/queries/CommitQuery";

describe('Commit query class', function () {
    it('should return the correct query after building it', function () {
        let projectId: number = 1234;
        let gitlabCommitQueryExecutor = new GitlabQueryExecutor<IGitlabCommit[]>();
        let commitQuery: CommitQuery = new CommitQuery(projectId, gitlabCommitQueryExecutor);

        commitQuery.buildQuery();
        let expected: string = commitQuery.getQuery();
        let actual: string = "https://gitlab.com/api/v4/projects/1234/repository/commits?all=true&with_stats=true";
        expect(expected).to.equal(actual);

    });
});