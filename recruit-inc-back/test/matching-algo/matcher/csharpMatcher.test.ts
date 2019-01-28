import { expect } from 'chai';
import 'mocha';
import { MatcherClient } from '../../../src/matching-algo/matcher-client/MatcherClient';
import { AbstractLanguageMatcher } from '../../../src/matching-algo/matcher/AbstractLanguageMatcher';
import { IGitProjectSummary } from '../../../src/matching-algo/data-model/output-model/IGitProjectSummary';
import { IGitProjectOutput } from '../../../src/matching-algo/data-model/output-model/IGitProjectOutput';
import { CsharpMatcher } from '../../../src/matching-algo/matcher/Csharp/csharpMatcher';

// Setup Language Matcher
const csharpMatcher: AbstractLanguageMatcher = new CsharpMatcher();
const customLanguageMatchers: AbstractLanguageMatcher[] = [csharpMatcher];

describe.only('Test csharp matching algorithm', () => {
  it('The csharp matcher should return the correct output object with rethinkdb-net repository', () => {
    // GIVEN
    const input = require('./input/rethinkdb-net.json');
    const expected = require('./expected-output/rethinkdb-net.out.json');
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
