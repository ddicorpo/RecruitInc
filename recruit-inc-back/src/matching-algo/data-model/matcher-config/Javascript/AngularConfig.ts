import { IMatcherConfig } from '../../matcher-model/IMatcherConfig';
import { Technologies } from '../../output-model/Technologies';
import { ITargetMatcher } from '../../matcher-model/ITargetMatcher';
/**
 * MatchingPattern is a regex used by the matching algo.
 * The regex is made to parse through source files (e.g. Package.json)
 * and to find installated pacakges.
 */
const matchingTargets: ITargetMatcher[] = [
  {
    sourceFileToParse: 'package.json',
    matchingPattern: '\@angular\/[a-zA-Z0-9]*" {0,1}: {0,1}"',
  },
];

export const angularConfig: IMatcherConfig = {
  technology: Technologies.Angular,
  extensions: ['js', 'ts'],
  matchingTargets,
  sourceFolder: 'src/',
  excludedFolders: ['node_modules'],
};
