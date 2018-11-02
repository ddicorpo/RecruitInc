import {IMatcherConfig} from "../../matcher-model/IMatcherConfig";
import {Technologies} from "../../output-model/Technologies";
import {ITargetMatcher} from "../../matcher-model/ITargetMatcher";

const matchingTargets: ITargetMatcher[] = [
    {
        sourceFileToParse: "package.json",
        matchingPattern: "(\"react\"|\"@type\\/react\") {0,1}: {0,1}\""
    }
];

export const reactConfig: IMatcherConfig = {
    technology: Technologies.React,
    extensions: ["js", "tsx", "ts"],
    matchingTargets,
    sourceFolder: "src/"
};
git