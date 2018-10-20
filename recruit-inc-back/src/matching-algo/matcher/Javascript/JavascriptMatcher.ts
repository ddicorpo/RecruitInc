import {AbstractLanguageMatcher} from "../AbstractLanguageMatcher";
import {IGitProjectInput} from "../../data-model/input-model/IGitProjectInput";
import {IMatcherConfig} from "../../data-model/matcher-model/IMatcherConfig";
import {javascriptConfig} from "../../data-model/matcher-config/Javascript/JavascriptConfig";

export class JavascriptMatcher extends AbstractLanguageMatcher{

    public constructor(matcherConfig: IMatcherConfig = javascriptConfig){
        super(matcherConfig);
    }
}