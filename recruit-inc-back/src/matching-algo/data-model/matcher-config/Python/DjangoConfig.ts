import {ITargetMatcher} from "../../matcher-model/ITargetMatcher";
import {IMatcherConfig} from "../../matcher-model/IMatcherConfig";
import {Technologies} from "../../output-model/Technologies";

const matchingTargets: ITargetMatcher[] = [
    {
        sourceFileToParse: "requirements.txt",
        matchingPattern: "(Django|django)"
    }
];

export const djangoConfig: IMatcherConfig = {
    technology: Technologies.Django,
    extensions: ["py"],
    matchingTargets,
    sourceFolder: null,
    excludedFolders: ["migrations", "__pycache__"]
};