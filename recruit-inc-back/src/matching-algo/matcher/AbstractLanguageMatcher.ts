import {AbstractMatcher} from "./AbstractMatcher";
import {IGitProjectInput} from "../data-model/input-model/IGitProjectInput";
import {AbstractFrameworkMatcher} from "./AbstractFrameworkMatcher";
import {IMatcherConfig} from "../data-model/matcher-model/IMatcherConfig";
import {IFrameworkOutput} from "../data-model/output-model/IFrameworkOutput";
import {ILanguageOutput} from "../data-model/output-model/ILanguageOutput";
import {ICodeOutput} from "../data-model/output-model/ICodeOutput";
import {Technologies} from "../data-model/output-model/Technologies";


export abstract class AbstractLanguageMatcher extends AbstractMatcher {

    private frameworks: AbstractFrameworkMatcher[];

    public constructor(projectsInput: IGitProjectInput, matcherConfig: IMatcherConfig, frameworks: AbstractFrameworkMatcher[] = []){
        super(projectsInput, matcherConfig);
        this.frameworks = frameworks;
    }

    public addFramework(framework: AbstractFrameworkMatcher): void {
        this.frameworks.push(framework);
    }

    protected package(codeOutput: ICodeOutput): ILanguageOutput {
        const frameworksOutput: IFrameworkOutput[] = [];
        for (const framework of this.frameworks) {
            frameworksOutput.push(framework.execute());
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
