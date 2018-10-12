/**
 * downloadedSourceFile are target files like: .gitignore, package.json, pom.xml
 */
import { ICommit } from './ICommit';
import { IProjectStructure } from './IProjectStructure';
export interface IGitProjectInput{
    projectName: string
    applicantCommits: ICommit[]
    projectStructure: IProjectStructure[]
    downloadedSourceFile: string[]
}