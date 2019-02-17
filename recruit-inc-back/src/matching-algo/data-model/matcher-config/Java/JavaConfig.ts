import { IMatcherConfig } from '../../matcher-model/IMatcherConfig';
import { Technologies } from '../../output-model/Technologies';
import { ITargetMatcher } from '../../matcher-model/ITargetMatcher';

const matchingTargets: ITargetMatcher[] = [];

export const JavaConfig: IMatcherConfig = {
  technology: Technologies.Java,
  extensions: ['java'],
  matchingTargets,
};
