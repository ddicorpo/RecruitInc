import { expect } from 'chai';
import 'mocha';
import { MatcherClient } from '../../../src/matching-algo/matcher-client/MatcherClient';
import { AbstractLanguageMatcher } from '../../../src/matching-algo/matcher/AbstractLanguageMatcher';
import { IGitProjectSummary } from '../../../src/matching-algo/data-model/output-model/IGitProjectSummary';
import { IGitProjectOutput } from '../../../src/matching-algo/data-model/output-model/IGitProjectOutput';
import { RubyMatcher } from '../../../src/matching-algo/matcher/Ruby/RubyMatcher';

//setting up the type matcher
const rubyMatcher: AbstractLanguageMatcher = new RubyMatcher();
const customLanguageMatchers: AbstractLanguageMatcher[] = [rubyMatcher];

describe('Test Ruby matching algorithm', () => {
  it('The Ruby matcher should return the correct output object with Ruby repository', () => {
    // GIVEN
    const input = require('./input/ruby.json');
    const expected = require('./expected-output/ruby.out.json');
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
