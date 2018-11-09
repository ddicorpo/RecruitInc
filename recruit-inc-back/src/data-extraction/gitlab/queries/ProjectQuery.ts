import { IGitlabQueryExecutor } from '../query-executor/IGitlabQueryExecutor';
import { AbstractGitlabQuery } from './AbstractGitlabQuery';
import { IGitlabProject } from '../api-entities/IGitlabProject';

export class ProjectQuery extends AbstractGitlabQuery<IGitlabProject[]> {
  private userId: number;

  public constructor(
    userId: number,
    queryExecutor: IGitlabQueryExecutor<IGitlabProject[]>
  ) {
    super(queryExecutor);
    this.userId = userId;
  }

  public buildQuery(): void {
    this.query =
      this.queryExecutor.getBaseGitlabApi() +
      'users/' +
      this.userId +
      '/projects?statistics=true';
  }
}
