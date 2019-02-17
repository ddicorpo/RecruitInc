import { AbstractLanguageMatcher } from '../AbstractLanguageMatcher';
import { IMatcherConfig } from '../../data-model/matcher-model/IMatcherConfig';
import { JavaConfig } from '../../data-model/matcher-config/Java/JavaConfig';

export class JavaMatcher extends AbstractLanguageMatcher {
  public constructor(matcherConfig: IMatcherConfig = JavaConfig) {
    super(matcherConfig);
  }
}
