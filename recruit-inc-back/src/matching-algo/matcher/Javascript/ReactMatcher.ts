import {IGitProjectOutput} from "../../data-model/output-model/IGitProjectOutput";
import {IGitProjectInput} from "../../data-model/input-model/IGitProjectInput";
import {Technologies} from "../../data-model/output-model/Technologies";
import {FilepathExtractor} from "../../../util/FilepathExtractor";
import {IFrameworkOutput} from "../../data-model/output-model/IFrameworkOutput";
import {ICodeOutput} from "../../data-model/output-model/ICodeOutput";
import {ILanguageOutput} from "../../data-model/output-model/ILanguageOutput";
import {AbstractFrameworkMatcher} from "../AbstractFrameworkMatcher";
import {ITargetMatcher} from "../../data-model/matcher-model/ITargetMatcher";

export class ReactMatcher extends AbstractFrameworkMatcher {

    private sourceFileToParse: string = "package.json";
    private result: IGitProjectOutput;

    public constructor(projectsInput: IGitProjectInput, matchingTargets: ITargetMatcher[],
                       targetTechnology : Technologies, matchingExtensions: string[]) {

        super(projectsInput, matchingTargets, targetTechnology, matchingExtensions);
        //this.reactPattern = matchingExtensions[0];
    }
    private sourceFolder = "src/";

    private allJavascriptExtensions = ["js", "ts"];

    public execute(): IGitProjectOutput {
        // Get the list of files we want
        const allProjectsOutput: IGitProjectOutput = null;
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

        return allProjectsOutput;
    }



}
