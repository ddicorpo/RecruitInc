import {AbstractMatcher} from "./AbstractMatcher";
import {IGitProjectInput} from "../data-model/input-model/IGitProjectInput";
import {IMatcherConfig} from "../data-model/matcher-model/IMatcherConfig";
import {IFrameworkOutput} from "../data-model/output-model/IFrameworkOutput";


export abstract class AbstractFrameworkMatcher extends AbstractMatcher {


    public constructor(projectsInput: IGitProjectInput, matcherConfig: IMatcherConfig){
        super(projectsInput, matcherConfig);
    }

    protected package(): IFrameworkOutput {
        const toto: IFrameworkOutput = null;
        return toto;
    }
}
