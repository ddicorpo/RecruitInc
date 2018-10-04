import { expect} from 'chai';
import {GitlabQueryExecutor} from "../../../../src/data-extraction/gitlab/query-executor/GitlabQueryExecutor";
import {UserQuery} from "../../../../src/data-extraction/gitlab/queries/UserQuery";
import {IGitlabUser} from "../../../../src/data-extraction/gitlab/api-entities/IGitlabUser";

describe('User query class', function () {
    it('should return the correct query after building it', function () {
        let username: string = "Hello";
        let gitlabUserQueryExecutor = new GitlabQueryExecutor<IGitlabUser[]>();
        let userQuery: UserQuery = new UserQuery(username, gitlabUserQueryExecutor);

        userQuery.buildQuery();
        let expected: string = userQuery.getQuery();
        let actual: string =  "https://gitlab.com/api/v4/users?username=Hello";
        expect(expected).to.equal(actual);
    });
});