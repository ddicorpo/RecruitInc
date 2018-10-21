import {AbstractFrameworkMatcher} from "../AbstractFrameworkMatcher";
import {IMatcherConfig} from "../../data-model/matcher-model/IMatcherConfig";
import {reactConfig} from "../../data-model/matcher-config/Javascript/ReactConfig";

export class ReactMatcher extends AbstractFrameworkMatcher {


    public constructor(matchingConfig: IMatcherConfig = reactConfig) {

        super(matchingConfig);
    }

}
