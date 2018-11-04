import {ITargetMatcher} from "../../matcher-model/ITargetMatcher";
import {IMatcherConfig} from "../../matcher-model/IMatcherConfig";
import {Technologies} from "../../output-model/Technologies";

const matchingTargets: ITargetMatcher[] = [
    {
        sourceFileToParse: "package.json",
        matchingPattern: "(\"typescript\"|\"\@types/node\") {0,1}: {0,1}\""
    }
];

export const typescriptConfig: IMatcherConfig = {
    technology: Technologies.Typescript,
    extensions: ["ts", "tsx"],
    matchingTargets,
    sourceFolder: null,
    vendorFolder: "node_modules"
};