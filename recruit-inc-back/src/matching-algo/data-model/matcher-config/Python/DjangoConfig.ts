import {ITargetMatcher} from "../../matcher-model/ITargetMatcher";
import {IMatcherConfig} from "../../matcher-model/IMatcherConfig";
import {Technologies} from "../../output-model/Technologies";
import {TechSourceFileEnum} from "../../input-model/TechSourceFileEnum";

const matchingTargets: ITargetMatcher[] = [
    {
        sourceFileToParse: TechSourceFileEnum.djangoRequirements,
        matchingPattern: "(Django|django)"
    }
];

export const djangoConfig: IMatcherConfig = {
    technology: Technologies.Django,
    extensions: ["py"],
    matchingTargets,
    sourceFolder: null,
    excludedFolders: ["migrations"]
};