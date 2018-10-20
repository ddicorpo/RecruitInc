import {AbstractMatcher} from "./AbstractMatcher";
import {IGitProjectInput} from "../data-model/input-model/IGitProjectInput";
import {IMatcherConfig} from "../data-model/matcher-model/IMatcherConfig";


export abstract class AbstractFrameworkMatcher extends AbstractMatcher {


    public constructor(projectsInput: IGitProjectInput, matcherConfig: IMatcherConfig){
        super(projectsInput, matcherConfig);
    }
}
