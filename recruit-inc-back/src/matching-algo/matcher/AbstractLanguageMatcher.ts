import {AbstractMatcher} from "./AbstractMatcher";
import {IGitProjectInput} from "../data-model/input-model/IGitProjectInput";
import {AbstractFrameworkMatcher} from "./AbstractFrameworkMatcher";
import {IMatcherConfig} from "../data-model/matcher-model/IMatcherConfig";


export abstract class AbstractLanguageMatcher extends AbstractMatcher {

    private frameworks: AbstractFrameworkMatcher[];

    public constructor(projectsInput: IGitProjectInput, matcherConfig: IMatcherConfig, frameworks: AbstractFrameworkMatcher[] = []){
        super(projectsInput, matcherConfig);
        this.frameworks = frameworks;
    }

    public addFramework(framework: AbstractFrameworkMatcher): void {
        this.frameworks.push(framework);
    }
}
