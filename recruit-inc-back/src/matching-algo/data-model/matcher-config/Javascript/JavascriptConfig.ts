import {IMatcherConfig} from "../../matcher-model/IMatcherConfig";
import {Technologies} from "../../output-model/Technologies";
import {ITargetMatcher} from "../../matcher-model/ITargetMatcher";

const matchingTargets: ITargetMatcher[] = [

];

export const javascriptConfig: IMatcherConfig = {
    technology: Technologies.Javascript,
    extensions: ["js", "ts"],
    matchingTargets
};
