import { AbstractFrameworkMatcher } from '../AbstractFrameworkMatcher';
import { IMatcherConfig } from '../../data-model/matcher-model/IMatcherConfig';
import { vueConfig } from '../../data-model/matcher-config/Javascript/VueConfig';

export class VueMatcher extends AbstractFrameworkMatcher {
  public constructor(matchingConfig: IMatcherConfig = vueConfig) {
    super(matchingConfig);
  }
}
