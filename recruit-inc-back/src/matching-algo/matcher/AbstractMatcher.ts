import {IGitProjectOutput} from "../data-model/output-model/IGitProjectOutput";
import {Technologies} from "../data-model/output-model/Technologies";
import {IGitProjectInput} from "../data-model/input-model/IGitProjectInput";
import {ISourceFiles} from "../data-model/input-model/ISourceFiles";
import * as fs from "fs";
import {ICodeOutput} from "../data-model/output-model/ICodeOutput";
import {ISingleFileCommit} from "../data-model/input-model/ISingleFileCommit";
import {ExtensionExtractor} from "../../util/ExtensionExtractor";
import {IProcessedSourceFile} from "../data-model/matcher-model/IProcessedSourceFile";
import {IMatcherConfig} from "../data-model/matcher-model/IMatcherConfig";
import {IFrameworkOutput} from "../data-model/output-model/IFrameworkOutput";
import {FilepathExtractor} from "../../util/FilepathExtractor";
import {ILanguageOutput} from "../data-model/output-model/ILanguageOutput";

export abstract class AbstractMatcher {

    protected technology: Technologies;
    protected projectInput: IGitProjectInput;
    //TODO: Refactor get data out of config, for more readability
    protected matchingConfig: IMatcherConfig;

    public constructor(projectInput: IGitProjectInput, matcherConfig: IMatcherConfig) {
        this.projectInput = projectInput;
        this.technology = matcherConfig.technology;
        this.matchingConfig = matcherConfig
    }

    public execute(): IFrameworkOutput | ILanguageOutput {
        // For each one, get a string representing the file
        const sourceFiles: IProcessedSourceFile[] = this.processSourceFiles();
        let numberOfLines: number = 0;
        const codeOutput: ICodeOutput = {
            linesOfCode : 0,
            numberOfCommits : 0
        };
        for (const sourceFile of sourceFiles) {


            // Parse the string to see if react is there
            const isTechnologyFound: boolean = sourceFile.isMatchingTechnology;


            if (isTechnologyFound) {
                // Get the folder in which the package.json file is
                //TODO: Replace 'this.sourceFolder'
                const extractedPath = FilepathExtractor.extract(sourceFile.repoFilePath) +
                    this.matchingConfig.sourceFolder;
                // Get all the files under the src folder that exists under the folder package.json is in
                // Get all commits of the person that match those files
                // Count the number of react lines
                const tempCodeOutput: ICodeOutput =
                    this.countCommitsAndLinesOfCode(extractedPath);

                codeOutput.linesOfCode += tempCodeOutput.linesOfCode;
                codeOutput.numberOfCommits += tempCodeOutput.numberOfCommits;

            }
        }
        return this.package(codeOutput);

    }

    protected processSourceFiles(): IProcessedSourceFile[] {
        const sourceFiles: ISourceFiles[] = this.projectInput.downloadedSourceFile;

        const sourceFilesOutput: IProcessedSourceFile[] = [];

        for (const sourceFile of sourceFiles) {
            const filename: string = sourceFile.filename;

            for (const matchingTarget of this.matchingConfig.matchingTargets) {

                const isFilenameMatchingFileToParse: boolean = filename === matchingTarget.sourceFileToParse;

                if (isFilenameMatchingFileToParse) {
                    let filetext = null;
                    let isMatchingTechnology: boolean = false;
                    try {
                        filetext = this.readTargetFile(sourceFile.localFilePath);
                        isMatchingTechnology = this.isTechnologyFound(filetext, matchingTarget.matchingPattern);
                    } catch (exception) {

                        // TODO: add logging here
                        console.log(exception);
                        continue;
                    } finally {
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
        }
        return sourceFilesOutput;
    }

    protected abstract package(codeOutput: ICodeOutput): IFrameworkOutput | ILanguageOutput;

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

        for (const extension of this.matchingConfig.extensions) {
            if (extension === fileExtension) {
                isMatchFound = true;
                break;
            }
        }

        return isMatchFound;
    }

}
