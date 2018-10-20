import {IGitProjectInput} from "../../data-model/input-model/IGitProjectInput";
import {ITargetMatcher} from "../../data-model/matcher-model/ITargetMatcher";
import {Technologies} from "../../data-model/output-model/Technologies";
import {AbstractFrameworkMatcher} from "../AbstractFrameworkMatcher";

export class TypescriptMatcher extends AbstractFrameworkMatcher {
    public constructor(projectsInput: IGitProjectInput, matchingTargets: ITargetMatcher[],
                       targetTechnology : Technologies, matchingExtensions: string[]){

        super(projectsInput, matchingTargets, targetTechnology, matchingExtensions);
    }
}