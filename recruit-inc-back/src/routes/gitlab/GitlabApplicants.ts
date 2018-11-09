import { Request, Response } from 'express';
import { GitlabQueryExecutor } from '../../data-extraction/gitlab/query-executor/GitlabQueryExecutor';
import { UserQuery } from '../../data-extraction/gitlab/queries/UserQuery';
import { IGitlabUser } from '../../data-extraction/gitlab/api-entities/IGitlabUser';
import { IGitlabProject } from '../../data-extraction/gitlab/api-entities/IGitlabProject';
import { ProjectQuery } from '../../data-extraction/gitlab/queries/ProjectQuery';
import { RepositoryTreeQuery } from '../../data-extraction/gitlab/queries/RepositoryTreeQuery';
import { IGitlabRepositoryTree } from '../../data-extraction/gitlab/api-entities/IGitlabRepositoryTree';
import { IGitlabCommit } from '../../data-extraction/gitlab/api-entities/IGitlabCommit';
import { CommitQuery } from '../../data-extraction/gitlab/queries/CommitQuery';
import { CommitDiffQuery } from '../../data-extraction/gitlab/queries/CommitDiffQuery';
import { IGitlabCommitDiff } from '../../data-extraction/gitlab/api-entities/IGitlabCommitDiff';
var logger = require('../../logger.js');

var cors = require('cors');

let dataFile: string = 'log/info.json';

export class GitlabApplicants {
  public routes(app): void {
    app
      .route('/api/gitlab/users/:username')
      .get(cors(), async (request: Request, response: Response) => {
        logger.info(
          {
            class: 'GitlabApplicants',
            method: 'routes',
            action: '/api/gitlab/users/:username',
            value: { request, response },
          },
          { timestamp: new Date().toLocaleTimeString(), processID: process.pid }
        );

        let username: string = request.params.username;
        let gitlabUserQueryExecutor = new GitlabQueryExecutor<IGitlabUser[]>();
        let userQuery: UserQuery = new UserQuery(
          username,
          gitlabUserQueryExecutor
        );

        userQuery.buildQuery();
        let gitlabUserPromise: Promise<
          IGitlabUser[]
        > = userQuery.executeQuery();

        let gitlabUsers: IGitlabUser[] = await gitlabUserPromise;

        let userId: number = gitlabUsers[0].id;
        let gitlabProjectQueryExecutor = new GitlabQueryExecutor<
          IGitlabProject[]
        >();
        let projectQuery: ProjectQuery = new ProjectQuery(
          userId,
          gitlabProjectQueryExecutor
        );

        projectQuery.buildQuery();
        let gitlabProjectPromise: Promise<
          IGitlabProject[]
        > = projectQuery.executeQuery();
        let gitlabProjects: IGitlabProject[] = await gitlabProjectPromise;
        let projectId: number = gitlabProjects[0].id;

        let gitlabTreeQueryExecutor = new GitlabQueryExecutor<
          IGitlabRepositoryTree[]
        >();
        let treeQuery: RepositoryTreeQuery = new RepositoryTreeQuery(
          projectId,
          gitlabTreeQueryExecutor
        );

        treeQuery.buildQuery();
        let gitlabTreePromise: Promise<
          IGitlabRepositoryTree[]
        > = treeQuery.executeQuery();
        let gitlabTree: IGitlabRepositoryTree[] = await gitlabTreePromise;

        let gitlabCommitQueryExecutor = new GitlabQueryExecutor<
          IGitlabCommit[]
        >();
        let commitQuery: CommitQuery = new CommitQuery(
          projectId,
          gitlabCommitQueryExecutor
        );

        commitQuery.buildQuery();
        let gitlabCommitPromise: Promise<
          IGitlabCommit[]
        > = commitQuery.executeQuery();
        let gitlabCommit: IGitlabCommit[] = await gitlabCommitPromise;

        let commitSha1: string = gitlabCommit[0].id;
        let gitlabCommitDiffQueryExecutor = new GitlabQueryExecutor<
          IGitlabCommitDiff[]
        >();
        let commitDiffQuery: CommitDiffQuery = new CommitDiffQuery(
          projectId,
          commitSha1,
          gitlabCommitDiffQueryExecutor
        );

        commitDiffQuery.buildQuery();
        let gitlabCommitDiffPromise: Promise<
          IGitlabCommitDiff[]
        > = commitDiffQuery.executeQuery();
        let gitlabDiffCommit: IGitlabCommitDiff[] = await gitlabCommitDiffPromise;

        let returnValue = {
          userQuery: userQuery.getQuery(),
          userResponse: gitlabUsers,
          projectQuery: projectQuery.getQuery(),
          projectResponse: gitlabProjects,
          repositoryTreeQuery: treeQuery.getQuery(),
          repositoryTreeResponse: gitlabTree,
          commitQuery: commitQuery.getQuery(),
          commitResponse: gitlabCommit,
          commitDiffQuery: commitDiffQuery.getQuery(),
          commitDiffResponse: gitlabDiffCommit,
        };
        response.status(200).send(returnValue);
      });
  }
}
