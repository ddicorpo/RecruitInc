import {AbstractMatcher} from "./AbstractMatcher";
import {Technologies} from "../data-model/output-model/Technologies";
import {IGitProjectInput} from "../data-model/input-model/IGitProjectInput";
import {ITargetMatcher} from "../data-model/matcher-model/ITargetMatcher";
import {AbstractFrameworkMatcher} from "./AbstractFrameworkMatcher";


export abstract class AbstractLanguageMatcher extends AbstractMatcher {

    private frameworks: AbstractFrameworkMatcher[];

    public constructor(projectsInput: IGitProjectInput, matchingTargets: ITargetMatcher[], targetTechnology : Technologies, matchingExtensions: string[], frameworks: AbstractFrameworkMatcher[] = []){
        super(projectsInput, matchingTargets, targetTechnology, matchingExtensions);
        this.frameworks = frameworks;
    }

    public addFramework(framework: AbstractFrameworkMatcher): void {
        this.frameworks.push(framework);
    }
}
