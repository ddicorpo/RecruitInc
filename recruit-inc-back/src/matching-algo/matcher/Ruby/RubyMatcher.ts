import { AbstractLanguageMatcher } from '../AbstractLanguageMatcher';
import { IMatcherConfig } from '../../data-model/matcher-model/IMatcherConfig';
import { RubyConfig } from '../../data-model/matcher-config/Ruby/RubyConfig';

export class RubyMatcher extends AbstractLanguageMatcher {
  public constructor(matchingConfig: IMatcherConfig = RubyConfig) {
    super(matchingConfig);
  }
}
