export interface IGitlabQueryExecutor<Response> {
    executeQuery: (query:String)=>Promise<Response>,
    executeDownloadQuery: (query:String)=>Promise<Response>,
    getBaseGitlabApi: ()=> string
}