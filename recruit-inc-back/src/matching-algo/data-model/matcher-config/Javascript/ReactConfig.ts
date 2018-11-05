import {IMatcherConfig} from "../../matcher-model/IMatcherConfig";
import {Technologies} from "../../output-model/Technologies";
import {ITargetMatcher} from "../../matcher-model/ITargetMatcher";
import {TechSourceFileEnum} from "../../input-model/TechSourceFileEnum";

const matchingTargets: ITargetMatcher[] = [
    {
        sourceFileToParse: TechSourceFileEnum.packageJson,
        matchingPattern: "(\"react\"|\"\@types\\/react\") {0,1}: {0,1}\""

    }
];

export const reactConfig: IMatcherConfig = {
    technology: Technologies.React,
    extensions: ["js", "tsx", "ts"],
    matchingTargets,
    sourceFolder: "src/",
    excludedFolders: ["node_modules"]
};