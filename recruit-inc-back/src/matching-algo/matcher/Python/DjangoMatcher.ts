import { AbstractFrameworkMatcher } from '../AbstractFrameworkMatcher';
import { IMatcherConfig } from '../../data-model/matcher-model/IMatcherConfig';
import { djangoConfig } from '../../data-model/matcher-config/Python/DjangoConfig';

export class DjangoMatcher extends AbstractFrameworkMatcher {
  public constructor(matcherConfig: IMatcherConfig = djangoConfig) {
    super(matcherConfig);
  }
}
