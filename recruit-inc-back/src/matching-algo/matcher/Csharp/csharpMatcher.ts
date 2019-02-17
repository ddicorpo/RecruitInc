import { AbstractLanguageMatcher } from '../AbstractLanguageMatcher';
import { IMatcherConfig } from '../../data-model/matcher-model/IMatcherConfig';
import { csharpConfig } from '../../data-model/matcher-config/Csharp/csharpConfig';

export class CsharpMatcher extends AbstractLanguageMatcher {
  public constructor(matchingConfig: IMatcherConfig = csharpConfig) {
    super(matchingConfig);
  }
}
