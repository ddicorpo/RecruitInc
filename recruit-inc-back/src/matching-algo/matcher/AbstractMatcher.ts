import { IGitProjectOutput } from "../data-model/output-model/IGitProjectOutput";
import { Technologies } from "../data-model/output-model/Technologies";
import {IGitProjectInput} from "../data-model/input-model/IGitProjectInput";
import {ITargetMatcher} from "../data-model/matcher-model/ITargetMatcher";
import {ISourceFiles} from "../data-model/input-model/ISourceFiles";
import * as fs from "fs";
import {ICodeOutput} from "../data-model/output-model/ICodeOutput";
import {ISingleFileCommit} from "../data-model/input-model/ISingleFileCommit";
import {ExtensionExtractor} from "../../util/ExtensionExtractor";
import {IProcessedSourceFile} from "../data-model/matcher-model/IProcessedSourceFile";
export abstract class AbstractMatcher {

    protected matchingTargets: ITargetMatcher[];
    protected technology : Technologies;
    protected projectInput : IGitProjectInput;
    protected matchingExtensions: string[];

    public constructor(projectInput: IGitProjectInput, matchingTargets: ITargetMatcher[], targetTechnology : Technologies, matchingExtensions: string[]){
        this.projectInput = projectInput;
        this.technology = targetTechnology;
        this.matchingExtensions = matchingExtensions;
        this.matchingTargets = matchingTargets
    }

    public execute(): IGitProjectOutput{
        console.log('I am executing....');
        return new class implements IGitProjectOutput {
            languageOutput: [];
            projectName: "empty";
        }
    }

    protected processSourceFiles(): IProcessedSourceFile[] {
        const sourceFiles: ISourceFiles[] = this.projectInput.downloadedSourceFile;

        const sourceFilesOutput: IProcessedSourceFile[] = [];

        for (const sourceFile of sourceFiles) {
            const filename: string = sourceFile.filename;

            for (const matchingTarget of this.matchingTargets) {

                const isFilenameMatchingFileToParse: boolean = filename === matchingTarget.sourceFileToParse;

                if (isFilenameMatchingFileToParse) {
                    let filetext = null;
                    try {
                        filetext = this.readTargetFile(sourceFile.localFilePath);
                    } catch (exception) {

                        // TODO: add logging here
                        console.log(exception);
                        continue;
                    }

                    const isMatchingTechnology: boolean = this.isTechnologyFound(filetext, matchingTarget.matchingPattern);

                    const processedSourceFile: IProcessedSourceFile = {
                        filename: sourceFile.filename,
                        repoFilePath: sourceFile.repoFilePath,
                        localFilePath: sourceFile.localFilePath,
                        isMatchingTechnology
                    };
                    sourceFilesOutput.push(processedSourceFile);
                }

            }
        }
        return sourceFilesOutput;
    }

    protected readTargetFile(filePath: string): string {
        return fs.readFileSync(filePath, 'utf8');
    }

    protected isTechnologyFound(filetext: string, pattern: string): boolean {
        const regularExpression: RegExp = new RegExp(pattern);
        return regularExpression.test(filetext);
    }

    protected countCommitsAndLinesOfCode(basePath: string): ICodeOutput {
        const commits = this.projectInput.applicantCommits;
        const codeOutput: ICodeOutput = {
            linesOfCode: 0,
            numberOfCommits: 0
        };
        let numberOfLines: number = 0;
        for (const commit of commits) {
            const singleFileCommits: ISingleFileCommit[] = commit.files;
            const numberOfLinesInCommit: number = this.countNumberOfLinesInSingleFileCommits(singleFileCommits, basePath);
            numberOfLines += numberOfLinesInCommit;
            if (numberOfLinesInCommit !== 0) {
                codeOutput.numberOfCommits += 1;
            }
        }
        codeOutput.linesOfCode = numberOfLines;
        return codeOutput;
    }

    protected countNumberOfLinesInSingleFileCommits(commits: ISingleFileCommit[], basePath: string): number {
        let numberOfLines: number = 0;
        for (const commit of commits) {
            const filePath: string = commit.filePath;
            const isOfBasePath: boolean = this.isFilePathContainingBasePath(filePath, basePath);
            const isOfExtension: boolean = this.isFilepathOfExtension(filePath);
            if (isOfBasePath && isOfExtension) {
                numberOfLines += commit.lineAdded;
                numberOfLines -= commit.lineDeleted;
            }
        }
        return numberOfLines;
    }

    protected isFilePathContainingBasePath(filePath: string, basePath: string): boolean {
        const basePathLength: number = basePath.length;
        return filePath.substring(0, basePathLength) === basePath;
    }

    protected isFilepathOfExtension(filePath: string): boolean {
        const fileExtension: string = ExtensionExtractor.extract(filePath);
        let isMatchFound: boolean = false;

        for (const extension of this.matchingExtensions) {
            if (extension === fileExtension) {
                isMatchFound = true;
                break;
            }
        }

        return isMatchFound;
    }

}
