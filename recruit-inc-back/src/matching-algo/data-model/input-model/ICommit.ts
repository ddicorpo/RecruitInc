import { ISingleFileCommit } from './ISingleFileCommit'
export interface ICommit {
    id: string,
    numberOfFileAffected: number,
    files: ISingleFileCommit[]
}