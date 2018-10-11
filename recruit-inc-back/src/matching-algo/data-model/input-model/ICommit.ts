interface ICommit{
    id: string,
    numberOfFileAffected: number,
    files: ISingleFileCommit[]
}