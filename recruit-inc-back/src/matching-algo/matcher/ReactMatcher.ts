import {AbstractMatcher} from "./AbstractMatcher";
import {IDataEntry} from "../data-model/input-model/IDataEntry";
import {IGitProjectOutput} from "../data-model/output-model/IGitProjectOutput";
import {IGitProjectInput} from "../data-model/input-model/IGitProjectInput";
import {Technologies} from "../data-model/output-model/Technologies";
import * as fs from "fs";
import {ISourceFiles} from "../data-model/input-model/ISourceFiles";
import {ISingleFileCommit} from "../data-model/input-model/ISingleFileCommit";
import {ExtensionExtractor} from "../../util/ExtensionExtractor";
import {ICommit} from "../data-model/input-model/ICommit";
import {FilepathExtractor} from "../../util/FilepathExtractor";
import {IFrameworkOutput} from "../data-model/output-model/IFrameworkOutput";
import {ICodeOutput} from "../data-model/output-model/ICodeOutput";
import {ILanguageOutput} from "../data-model/output-model/ILanguageOutput";

export class ReactMatcher extends AbstractMatcher {

    private sourceFileToParse: string = "package.json";
    private reactPattern;
    private result: IGitProjectOutput;


    public constructor(projectsInput: IDataEntry, targetTechnologie: Technologies,
                       reactPattern: string = "(\"react\"|\"@type\\/react\") {0,1}: {0,1}\"") {

        super(projectsInput, targetTechnologie);
        this.reactPattern = reactPattern;
    }

    private sourceFolder = "src/";

    private allJavascriptExtensions = ["js", "ts"];

    public execute(): IGitProjectOutput[] {
        // Get the list of files we want
        const allProjectsOutput: IGitProjectOutput[] = [];
        const allProjects: IGitProjectInput[] = this.projectInput.projectInputs;
        for (const project of allProjects) {
            // For each one, get a string representing the file
            const sourceFiles: IProcessedSourceFile[] = this.sourceFilePathToParse(project);

            let reactPathList: string[] = [];

            let numberOfLines: number = 0;
            const frameworkOutput: IFrameworkOutput = {
                technologieName: this.technology,
                linesOfCode: 0,
                numberOfCommits: 0
            };
            for (const sourceFile of sourceFiles) {
                // Parse the string to see if react is there
                const isTechnologyFound: boolean = this.isTechnologyFound(sourceFile.filetext);


                if (isTechnologyFound) {
                    // Get the folder in which the package.json file is
                    const extractedPath = FilepathExtractor.extract(sourceFile.repoFilePath) + this.sourceFolder;
                    // Get all the files under the src folder that exists under the folder package.json is in
                    // Get all commits of the person that match those files
                    // Count the number of react lines
                    const codeOutput: ICodeOutput =
                        this.countCommitsAndLinesOfCode(project.applicantCommits, this.allJavascriptExtensions, extractedPath);
                    frameworkOutput.linesOfCode += codeOutput.linesOfCode;
                    frameworkOutput.numberOfCommits += codeOutput.numberOfCommits;

                }

            }
            const javascriptCodeOutput: ICodeOutput =
                this.countCommitsAndLinesOfCode(project.applicantCommits, this.allJavascriptExtensions, "");

            const typescriptCodeOutput: ICodeOutput =
                this.countCommitsAndLinesOfCode(project.applicantCommits, ["ts"], "");

            const typescriptOutput: IFrameworkOutput = {
                technologieName: Technologies.Typescript,
                linesOfCode: typescriptCodeOutput.linesOfCode,
                numberOfCommits: typescriptCodeOutput.numberOfCommits
            };

            const javascriptOutput: ILanguageOutput = {
                languageOrFramework: Technologies.Javascript,
                linesOfCode: javascriptCodeOutput.linesOfCode,
                numberOfCommits: javascriptCodeOutput.numberOfCommits,
                frameworks: [typescriptOutput, frameworkOutput]
            };

            const projectOutput: IGitProjectOutput = {
                projectName: project.projectName,
                languageOutput: [javascriptOutput]
            };

            allProjectsOutput.push(projectOutput);

        }

        // Get all commits that match .js file extension

        // Count number of lines

        // Get all commits that match .ts file extension (LATER)

        // Count number of lines

        // Package object and return

        // Refactor to make this pretty

        return allProjectsOutput;
    }



}
