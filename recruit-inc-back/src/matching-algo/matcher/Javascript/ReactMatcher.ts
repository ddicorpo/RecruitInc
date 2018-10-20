import {AbstractFrameworkMatcher} from "../AbstractFrameworkMatcher";
import {IMatcherConfig} from "../../data-model/matcher-model/IMatcherConfig";
import {typescriptConfig} from "../../data-model/matcher-config/Javascript/TypescriptConfig";

export class ReactMatcher extends AbstractFrameworkMatcher {


    public constructor(matchingConfig: IMatcherConfig = typescriptConfig) {

        super(matchingConfig);
    }

}
