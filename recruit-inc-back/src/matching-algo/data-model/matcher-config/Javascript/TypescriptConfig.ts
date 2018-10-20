import {ITargetMatcher} from "../../matcher-model/ITargetMatcher";
import {IMatcherConfig} from "../../matcher-model/IMatcherConfig";
import {Technologies} from "../../output-model/Technologies";

const matchingTargets: ITargetMatcher[] = [

];

export const typescriptConfig: IMatcherConfig = {
    technology: Technologies.Javascript,
    extensions: ["ts"],
    matchingTargets
};