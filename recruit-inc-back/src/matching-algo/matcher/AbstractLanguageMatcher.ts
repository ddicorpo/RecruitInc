import {AbstractMatcher} from "./AbstractMatcher";
import {IGitProjectInput} from "../data-model/input-model/IGitProjectInput";
import {AbstractFrameworkMatcher} from "./AbstractFrameworkMatcher";
import {IMatcherConfig} from "../data-model/matcher-model/IMatcherConfig";
import {IFrameworkOutput} from "../data-model/output-model/IFrameworkOutput";
import {ILanguageOutput} from "../data-model/output-model/ILanguageOutput";
import {ICodeOutput} from "../data-model/output-model/ICodeOutput";

export abstract class AbstractLanguageMatcher extends AbstractMatcher {

    private frameworks: AbstractFrameworkMatcher[];

    public constructor(matcherConfig: IMatcherConfig, frameworks: AbstractFrameworkMatcher[] = []){
        super(matcherConfig);
        this.frameworks = frameworks;
    }

    public setProjectInput(projectInput: IGitProjectInput) {
        for (const framework of this.frameworks) {
            framework.setProjectInput(projectInput);
        }
        this.projectInput = projectInput;
    }

    public addFramework(framework: AbstractFrameworkMatcher): AbstractLanguageMatcher {
        this.frameworks.push(framework);
        return this;
    }

    public getFrameworks(): AbstractFrameworkMatcher[] {
        return this.frameworks;
    }

    protected computeCodeOutput(): ICodeOutput {
        return this.countCommitsAndLinesOfCode("");
    }

    protected package(codeOutput: ICodeOutput):   ILanguageOutput{
        const frameworksOutput: IFrameworkOutput[] = [];
        for (const framework of this.frameworks) {
            frameworksOutput.push(framework.execute() as IFrameworkOutput);
        }

        const languageOutput: ILanguageOutput = {
            languageOrFramework: this.technology,
            linesOfCode: codeOutput.linesOfCode,
            numberOfCommits: codeOutput.numberOfCommits,
            frameworks: frameworksOutput
        };
        return languageOutput;
    }
}
