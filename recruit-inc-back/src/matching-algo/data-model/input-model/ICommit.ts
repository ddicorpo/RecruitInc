import { ISingleFileCommit } from './ISingleFileCommit'
export interface ICommit {
    // The ID here corresponds to the commit hash
    id: string,
    numberOfFileAffected: number,
    // Corresponds to the array of individual files modified in a commit. For each files,
    // we are interested in knowing the file path, the number of lines added and the number of lines removed
    files: ISingleFileCommit[]
}