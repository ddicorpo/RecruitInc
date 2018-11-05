import {AbstractLanguageMatcher} from "../AbstractLanguageMatcher";
import {IMatcherConfig} from "../../data-model/matcher-model/IMatcherConfig";
import {pythonConfig} from "../../data-model/matcher-config/Python/PythonConfig";

export class PythonMatcher extends AbstractLanguageMatcher{

    public constructor(matcherConfig: IMatcherConfig = pythonConfig){
        super(matcherConfig);
    }
}