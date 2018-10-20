import {IGitProjectInput} from "../../data-model/input-model/IGitProjectInput";
import {AbstractFrameworkMatcher} from "../AbstractFrameworkMatcher";
import {IMatcherConfig} from "../../data-model/matcher-model/IMatcherConfig";
import {typescriptConfig} from "../../data-model/matcher-config/Javascript/TypescriptConfig";

export class TypescriptMatcher extends AbstractFrameworkMatcher {
    public constructor(projectsInput: IGitProjectInput, matcherConfig: IMatcherConfig = typescriptConfig){

        super(projectsInput, matcherConfig);
    }
}