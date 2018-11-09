export interface IGitlabQueryExecutor<Response> {
  executeQuery: (query: String) => Promise<Response>;
  getBaseGitlabApi: () => string;
}
