import {AbstractMatcher} from "./AbstractMatcher";
import {Technologies} from "../data-model/output-model/Technologies";
import {IGitProjectInput} from "../data-model/input-model/IGitProjectInput";
import {ITargetMatcher} from "../data-model/matcher-model/ITargetMatcher";


export abstract class AbstractFrameworkMatcher extends AbstractMatcher {


    public constructor(projectsInput: IGitProjectInput, matchingTargets: ITargetMatcher[], targetTechnology : Technologies, matchingExtensions: string[]){
        super(projectsInput, matchingTargets, targetTechnology, matchingExtensions);
    }
}
