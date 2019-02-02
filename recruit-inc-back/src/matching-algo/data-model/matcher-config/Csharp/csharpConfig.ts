import { IMatcherConfig } from '../../matcher-model/IMatcherConfig';
import { Technologies } from '../../output-model/Technologies';
import { ITargetMatcher } from '../../matcher-model/ITargetMatcher';

const matchingTargets: ITargetMatcher[] = [];

export const csharpConfig: IMatcherConfig = {
  technology: Technologies.Csharp,
  extensions: ['cs'],
  matchingTargets,
};
