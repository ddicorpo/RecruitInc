import { ITargetMatcher } from '../../matcher-model/ITargetMatcher';
import { IMatcherConfig } from '../../matcher-model/IMatcherConfig';
import { Technologies } from '../../output-model/Technologies';

const matchingTargets: ITargetMatcher[] = [
    {
      sourceFileToParse: 'requirements.txt',
      matchingPattern: 'Flask',
    },
  ];

export const flaskConfig: IMatcherConfig = {
  technology: Technologies.Flask,
  extensions: ['py'],
  matchingTargets,
  sourceFolder: null,
  excludedFolders: ['__pycache__']
};
