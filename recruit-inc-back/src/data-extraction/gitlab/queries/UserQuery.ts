import { IGitlabUser } from '../api-entities/IGitlabUser';
import { IGitlabQueryExecutor } from '../query-executor/IGitlabQueryExecutor';
import { AbstractGitlabQuery } from './AbstractGitlabQuery';

export class UserQuery extends AbstractGitlabQuery<IGitlabUser[]> {
  private username: string;

  public constructor(
    username: string,
    queryExecutor: IGitlabQueryExecutor<IGitlabUser[]>
  ) {
    super(queryExecutor);
    this.username = username;
  }

  public buildQuery(): void {
    this.query =
      this.queryExecutor.getBaseGitlabApi() + 'users?username=' + this.username;
  }
}
