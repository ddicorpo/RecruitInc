interface IGitProjectInput{
    projectName: string,
    applicantCommits: ICommit[]
    projectStructure: IProjectStructure[]
    downloadedSourceFile: string[]
}