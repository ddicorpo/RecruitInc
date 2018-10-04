interface IGitlabQueryExecutor<Response> {
    executeQuery: (query:String)=>Response,
    baseGitlabApi: "https://gitlab.com/api/v4/"
}