import {AbstractMatcher} from "./AbstractMatcher";
import {IDataEntry} from "../data-model/input-model/IDataEntry";
import {IGitProjectOutput} from "../data-model/output-model/IGitProjectOutput";
import {IGitProjectInput} from "../data-model/input-model/IGitProjectInput";
import {Technologies} from "../data-model/output-model/Technologies";
import * as fs from "fs";
import {ISourceFiles} from "../data-model/input-model/ISourceFiles";
import {ISingleFileCommit} from "../data-model/input-model/ISingleFileCommit";
import {ExtensionExtractor} from "../../util/ExtensionExtractor";


export interface IProcessedSourceFile extends ISourceFiles {
    "filetext": string,
    isTechnologyFound?: boolean
}

export class ReactMatcher extends AbstractMatcher {

    private sourceFileToParse: string = "package.json";
    private reactPattern;
    private result: IGitProjectOutput;


    public constructor(projectsInput: IDataEntry, targetTechnologie: Technologies,
                       reactPattern: string = "(\"react\"|\"@type\\/react\") {0,1}: {0,1}\"") {

        super(projectsInput, targetTechnologie);
        this.reactPattern = reactPattern;
    }

    public execute(): IGitProjectOutput {
        // Get the list of files we want
        const allProjects: IGitProjectInput[] = this.projectsInput.projectInputs;

        for (const project of allProjects) {
            const sourceFiles: IProcessedSourceFile[] = this.sourceFilePathToParse(project);


            for (const sourceFile of sourceFiles) {
                sourceFile.isTechnologyFound = this.isTechnologyFound(sourceFile.filetext);
            }



        }

        // For each one, get a string representing the file


        // Parse the string to see if react is there

        // Get the folder in which the package.json file is <-- you are here!

        // Get all the files under the src folder that exists under the folder package.json is in

        // Get all commits of the person that match those files

        // Count the number of react lines

        // Get all commits that match .js file extension

        // Count number of lines

        // Get all commits that match .ts file extension

        // Count number of lines

        // Package object and return

        // Refactor to make this pretty

        return null;
    }

    public sourceFilePathToParse(project: IGitProjectInput): IProcessedSourceFile[] {
        const sourceFiles: ISourceFiles[] = project.downloadedSourceFile;

        const sourceFilesOutput: IProcessedSourceFile[] = [];

        for (const sourceFile of sourceFiles) {
            console.log("SOURCE FILE: ", sourceFile);
            const filename: string = sourceFile.filename;

            const isFilenameMatchingFileToParse: boolean = filename === this.sourceFileToParse;

            console.log("isFilenameMatchingFileToParse: ", isFilenameMatchingFileToParse);
            if (isFilenameMatchingFileToParse) {
                let filetext = null;
                try {
                    filetext = this.readTargetFile(sourceFile.localFilePath);
                } catch (exception) {

                    // TODO: add logging here
                    console.log(exception);
                    continue;
                }

                const processedSourceFile: IProcessedSourceFile = {
                    filename: sourceFile.filename,
                    repoFilePath: sourceFile.repoFilePath,
                    localFilePath: sourceFile.localFilePath,
                    filetext
                };
                sourceFilesOutput.push(processedSourceFile);
            }
        }
        return sourceFilesOutput;
    }

    protected readTargetFile(filePath: string): string {
        return fs.readFileSync(filePath, 'utf8');
    }

    public isTechnologyFound(filetext: string): boolean {
        const regularExpression: RegExp = new RegExp(this.reactPattern);
        return regularExpression.test(filetext);
    }

    public countNumberOfLines(commits: ISingleFileCommit[], extensions: string[], basePath: string): number {
        let numberOfLines: number = 0;
        for (const commit of commits) {
            const filePath: string = commit.filePath;
            const isOfBasePath: boolean = this.isFilePathContainingBasePath(filePath, basePath);
            const isOfExtension: boolean = this.isFilepathOfExtension(filePath, extensions);
            if (isOfBasePath && isOfExtension) {
                numberOfLines += commit.lineAdded;
                numberOfLines -= commit.lineDeleted;
            }
        }
        return numberOfLines;
    }

    public isFilePathContainingBasePath(filePath: string, basePath: string): boolean {
        const basePathLength: number = basePath.length;
        return filePath.substring(0, basePathLength) === basePath;
    }

    public isFilepathOfExtension(filePath: string, extensions: string[]): boolean {
        const fileExtension: string = ExtensionExtractor.extract(filePath);
        let isMatchFound: boolean = false;

        for (const extension of extensions) {
            if (extension === fileExtension) {
                isMatchFound = true;
                break;
            }
        }

        return isMatchFound;
    }

}
