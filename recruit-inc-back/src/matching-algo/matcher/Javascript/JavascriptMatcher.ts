import {AbstractLanguageMatcher} from "../AbstractLanguageMatcher";
import {IMatcherConfig} from "../../data-model/matcher-model/IMatcherConfig";
import {javascriptConfig} from "../../data-model/matcher-config/Javascript/JavascriptConfig";

export class JavascriptMatcher extends AbstractLanguageMatcher{

    public constructor(matcherConfig: IMatcherConfig = javascriptConfig){
        super(matcherConfig);
    }
}