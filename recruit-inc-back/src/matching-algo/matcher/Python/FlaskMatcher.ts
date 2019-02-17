import { AbstractFrameworkMatcher } from '../AbstractFrameworkMatcher';
import { IMatcherConfig } from '../../data-model/matcher-model/IMatcherConfig';
import { flaskConfig } from '../../data-model/matcher-config/Python/FlaskConfig';

export class FlaskMatcher extends AbstractFrameworkMatcher {
  public constructor(matcherConfig: IMatcherConfig = flaskConfig) {
    super(matcherConfig);
  }
}
