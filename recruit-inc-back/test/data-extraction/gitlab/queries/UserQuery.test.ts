import { expect } from 'chai';
import { GitlabQueryExecutor } from '../../../../src/data-extraction/gitlab/query-executor/GitlabQueryExecutor';
import { UserQuery } from '../../../../src/data-extraction/gitlab/queries/UserQuery';
import { IGitlabUser } from '../../../../src/data-extraction/gitlab/api-entities/IGitlabUser';

const nock = require('nock');

describe('User query class', function() {

  beforeEach(() => {
    //mocking the API
    nock('https://api.gitlab.com')
      .post('/api/v4')
      .reply(200, {
        gitlabUserPromise: [{ id: 212577 }],
      });
  });

  it('should return the correct query after building it', function() {
    let username: string = 'Hello';
    let gitlabUserQueryExecutor = new GitlabQueryExecutor<IGitlabUser[]>();
    let userQuery: UserQuery = new UserQuery(username, gitlabUserQueryExecutor);

    userQuery.buildQuery();
    let expected: string = userQuery.getQuery();
    let actual: string = 'https://gitlab.com/api/v4/users?username=Hello';
    expect(expected).to.equal(actual);
  });

  //TODO: FIX THIS TEST!!! IT CALLS AN EXTERNAL API FOR SOME REASON.
  // it('should return a user with those specifications--> id ,name ,username, state ,avatar_url, web_url ', () => {
  //   let username: string = "rosarior"
  //   let gitlabUserQueryExecutor = new GitlabQueryExecutor<IGitlabUser[]>();
  //   let userQuery: UserQuery = new UserQuery(username, gitlabUserQueryExecutor);
  //   userQuery.buildQuery();
  //
  //   return userQuery.executeQuery()
  //   .then(response => response[0].id)
  //   .then(response => expect(response).to.equal(212577));
  //
  // });
});
