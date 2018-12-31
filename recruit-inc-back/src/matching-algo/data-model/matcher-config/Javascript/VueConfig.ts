import { IMatcherConfig } from '../../matcher-model/IMatcherConfig';
import { Technologies } from '../../output-model/Technologies';
import { ITargetMatcher } from '../../matcher-model/ITargetMatcher';

const matchingTargets: ITargetMatcher[] = [
  {
    sourceFileToParse: 'package.json',
    matchingPattern: '"vue" {0,1}: {0,1}".*"',
  },
];

export const vueConfig: IMatcherConfig = {
  technology: Technologies.Vue,
  extensions: ['js', 'vue', 'ts'],
  matchingTargets,
  sourceFolder: 'src/',
  excludedFolders: ['node_modules'],
};
