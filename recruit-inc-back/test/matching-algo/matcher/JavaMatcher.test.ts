import { expect } from 'chai';
import 'mocha';
import { MatcherClient } from '../../../src/matching-algo/matcher-client/MatcherClient';
import { AbstractLanguageMatcher } from '../../../src/matching-algo/matcher/AbstractLanguageMatcher';
import { IGitProjectSummary } from '../../../src/matching-algo/data-model/output-model/IGitProjectSummary';
import { IGitProjectOutput } from '../../../src/matching-algo/data-model/output-model/IGitProjectOutput';
import { JavaMatcher } from '../../../src/matching-algo/matcher/Java/JavaMatcher';

// Setup Language Matcher
const javaMatcher: AbstractLanguageMatcher = new JavaMatcher();
const customLanguageMatchers: AbstractLanguageMatcher[] = [javaMatcher];

describe('Test Java matching algorithm', () => {
  it('The Java matcher based on JSON extracted ', () => {
    // GIVEN
    const input = require('./input/pet-clinic.json');
    const expected = require('./expected-output/pet-clinic.json');
    const client: MatcherClient = new MatcherClient(
      input,
      customLanguageMatchers
    );

    // WHEN
    const computedOutput: IGitProjectSummary = client.execute();

    // THEN
    const length: number = computedOutput.projectsOutput.length;
    for (let index = 0; index < length; ++index) {
      const computedProjectSum: IGitProjectOutput =
        computedOutput.projectsOutput[index];
      if (JSON.stringify(expected) !== JSON.stringify(computedProjectSum)) {
        console.log('expected : ' + JSON.stringify(expected));
        console.log('actual: ' + JSON.stringify(computedProjectSum));
        expect.fail();
      }
    }
  });
});
