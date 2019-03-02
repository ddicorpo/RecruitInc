import { expect } from 'chai';
import 'mocha';
import { MatcherClient } from '../../../src/matching-algo/matcher-client/MatcherClient';
import { AbstractLanguageMatcher } from '../../../src/matching-algo/matcher/AbstractLanguageMatcher';
import { AbstractFrameworkMatcher } from '../../../src/matching-algo/matcher/AbstractFrameworkMatcher';
import { IGitProjectSummary } from '../../../src/matching-algo/data-model/output-model/IGitProjectSummary';
import { IGitProjectOutput } from '../../../src/matching-algo/data-model/output-model/IGitProjectOutput';
import { FlaskMatcher } from '../../../src/matching-algo/matcher/Python/FlaskMatcher';
import { PythonMatcher } from '../../../src/matching-algo/matcher/Python/PythonMatcher';

// Setup Language Matcher with Python and django
const flaskMatcher: AbstractFrameworkMatcher = new FlaskMatcher();
const pythonMatcher: AbstractLanguageMatcher = new PythonMatcher();

pythonMatcher.addFramework(flaskMatcher);
const customLanguageMatchers: AbstractLanguageMatcher[] = [pythonMatcher];

describe('Test Flask matching algorithm', () => {
    it('The Flask-Python matcher should return the correct output object', () => {
     // GIVEN
    const input = require('./input/recipesapp.json');
    const expected = require('./expected-output/recipesapp.out.json');
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