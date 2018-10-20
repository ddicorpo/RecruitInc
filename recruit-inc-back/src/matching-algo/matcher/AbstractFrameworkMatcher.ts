import {AbstractMatcher} from "./AbstractMatcher";
import {IGitProjectInput} from "../data-model/input-model/IGitProjectInput";
import {IMatcherConfig} from "../data-model/matcher-model/IMatcherConfig";
import {IFrameworkOutput} from "../data-model/output-model/IFrameworkOutput";
import {ILanguageOutput} from "../data-model/output-model/ILanguageOutput";
import {ICodeOutput} from "../data-model/output-model/ICodeOutput";


export abstract class AbstractFrameworkMatcher extends AbstractMatcher {


    public constructor(projectsInput: IGitProjectInput, matcherConfig: IMatcherConfig){
        super(projectsInput, matcherConfig);
    }

    protected package(codeOutput: ICodeOutput): IFrameworkOutput {
        const frameworkOutput: IFrameworkOutput = {
            technologyName: this.technology,
            linesOfCode: codeOutput.linesOfCode,
            numberOfCommits: codeOutput.numberOfCommits,
        };

        return frameworkOutput;
    }
}
