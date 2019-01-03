import { AbstractFrameworkMatcher } from '../AbstractFrameworkMatcher';
import { IMatcherConfig } from '../../data-model/matcher-model/IMatcherConfig';
import { angularConfig } from '../../data-model/matcher-config/Javascript/AngularConfig';

export class AngularMatcher extends AbstractFrameworkMatcher {
  public constructor(matchingConfig: IMatcherConfig = angularConfig) {
    super(matchingConfig);
  }
}
