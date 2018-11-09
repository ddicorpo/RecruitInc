import { IGitlabQueryExecutor } from '../query-executor/IGitlabQueryExecutor';
import { AbstractGitlabQuery } from './AbstractGitlabQuery';
import { IGitlabCommit } from '../api-entities/IGitlabCommit';

export class CommitQuery extends AbstractGitlabQuery<IGitlabCommit[]> {
  private projectId: number;

  public constructor(
    projectId: number,
    queryExecutor: IGitlabQueryExecutor<IGitlabCommit[]>
  ) {
    super(queryExecutor);
    this.projectId = projectId;
  }

  public buildQuery(): void {
    this.query =
      this.queryExecutor.getBaseGitlabApi() +
      'projects/' +
      this.projectId +
      '/repository/commits?all=true&with_stats=true';
  }
}
