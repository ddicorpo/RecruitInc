import { IMatcherConfig } from '../../matcher-model/IMatcherConfig';
import { Technologies } from '../../output-model/Technologies';
import { ITargetMatcher } from '../../matcher-model/ITargetMatcher';

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
