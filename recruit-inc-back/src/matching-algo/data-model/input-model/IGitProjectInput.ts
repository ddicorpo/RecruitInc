/**
 * downloadedSourceFile are target files like: .gitignore, package.json, pom.xml
 */
import { ICommit } from './ICommit';
import { IProjectStructure } from './IProjectStructure';
import {ISourceFiles} from "./ISourceFiles";
export interface IGitProjectInput{
    projectName: string
    applicantCommits: ICommit[]
    projectStructure: IProjectStructure[]
    // Here we want an array of file paths. We basically want to know where the relevant files (package.json, etc)
    // were downloaded.
    downloadedSourceFile: ISourceFiles[]
}