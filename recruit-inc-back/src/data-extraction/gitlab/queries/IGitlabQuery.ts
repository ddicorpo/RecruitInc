interface IGitlabQuery<Response> {
    query: string,
    response: Response
    queryExecutor: IGitlabQueryExecutor<Response>,
    buildQuery: ()=>void,
    getQuery: ()=>string,
    executeQuery: ()=>Response
}