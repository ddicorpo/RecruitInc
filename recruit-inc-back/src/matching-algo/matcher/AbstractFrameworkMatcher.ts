import {IMatcherConfig} from "../data-model/matcher-model/IMatcherConfig";
import {IFrameworkOutput} from "../data-model/output-model/IFrameworkOutput";
import {ICodeOutput} from "../data-model/output-model/ICodeOutput";
import {IProcessedSourceFile} from "../data-model/matcher-model/IProcessedSourceFile";
import {FilepathExtractor} from "../../util/FilepathExtractor";
import {AbstractLanguageMatcher} from "./AbstractLanguageMatcher";
import {ILanguageOutput} from "../data-model/output-model/ILanguageOutput";


export abstract class AbstractFrameworkMatcher extends AbstractLanguageMatcher {

    public constructor(matcherConfig: IMatcherConfig){
        super(matcherConfig);
    }

    protected computeCodeOutput(): ICodeOutput {
        const codeOutput: ICodeOutput = {
            linesOfCode: 0,
            numberOfCommits: 0
        };
        // Here we process all the downloaded files to see if they match our technology
        const sourceFiles: IProcessedSourceFile[] = this.processSourceFiles();
        for (const sourceFile of sourceFiles) {


            // Now we revisit the source files and see if they matched our technology
            const isTechnologyFound: boolean = sourceFile.isMatchingTechnology;

            if (isTechnologyFound) {
                // Get the source folder that is on the same level as the targeted source file
                // Ex: if our downloaded source file "package.json" was at frontend/package.json
                // and there is a source folder src existing right besides the package.json
                // then we want to look under frontend/src
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
        //TODO: Make this a logger action
        console.log("returning code output with " + codeOutput.linesOfCode + ", "
        + codeOutput.numberOfCommits);
        return codeOutput;
    }

    public execute(): IFrameworkOutput | ILanguageOutput {
        const codeOutput = this.computeCodeOutput();
        return this.package(codeOutput);
    }
    protected package(codeOutput: ICodeOutput): IFrameworkOutput  | ILanguageOutput{
        const frameworkOutput: IFrameworkOutput = {
            technologyName: this.technology,
            linesOfCode: codeOutput.linesOfCode,
            numberOfCommits: codeOutput.numberOfCommits,
        };

        return frameworkOutput;
    }
}
