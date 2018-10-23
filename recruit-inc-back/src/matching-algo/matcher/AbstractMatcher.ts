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
import {ILanguageOutput} from "../data-model/output-model/ILanguageOutput";


export abstract class AbstractMatcher {
    logger = require('../../logger.js');
    technology: Technologies;
    protected projectInput: IGitProjectInput;
    //TODO: Refactor get data out of config, for more readability
    protected matchingConfig: IMatcherConfig;

    public constructor(matcherConfig: IMatcherConfig) {
        this.technology = matcherConfig.technology;
        this.matchingConfig = matcherConfig;
    }

    public setProjectInput(projectInput: IGitProjectInput) {
        this.projectInput = projectInput;
    }

    public execute(): IFrameworkOutput | ILanguageOutput {
        const codeOutput = this.computeCodeOutput();
        return this.package(codeOutput);
    }

    protected abstract computeCodeOutput(): ICodeOutput;

    protected abstract package(codeOutput: ICodeOutput): IFrameworkOutput | ILanguageOutput;

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
                        this.logger.error({
                                class: this.technology + "Matcher", method: "processSourceFiles",
                                action: exception, params: {filename}
                            },
                            {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
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

    private readTargetFile(filePath: string): string {
        return fs.readFileSync(filePath, 'utf8');
    }

    private isTechnologyFound(filetext: string, pattern: string): boolean {
        const regularExpression: RegExp = new RegExp(pattern);
        return regularExpression.test(filetext);
    }

    private countNumberOfLinesInSingleFileCommits(commits: ISingleFileCommit[], basePath: string): number {
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

    private isFilePathContainingBasePath(filePath: string, basePath: string): boolean {
        const basePathLength: number = basePath.length;
        return filePath.substring(0, basePathLength) === basePath;
    }

    private isFilepathOfExtension(filePath: string): boolean {
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