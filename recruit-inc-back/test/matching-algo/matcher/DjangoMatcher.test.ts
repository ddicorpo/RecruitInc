import { expect } from 'chai';
import 'mocha';
import { dataEntry } from '../data-model/python-example/GitProjectInputExampleDjango';
import { projectOutput } from '../data-model/python-example/GitProjectOutputExampleDjango';
import { MatcherClient } from '../../../src/matching-algo/matcher-client/MatcherClient';
import { AbstractLanguageMatcher } from '../../../src/matching-algo/matcher/AbstractLanguageMatcher';
import { AbstractFrameworkMatcher } from '../../../src/matching-algo/matcher/AbstractFrameworkMatcher';
import { IGitProjectSummary } from '../../../src/matching-algo/data-model/output-model/IGitProjectSummary';
import { IGitProjectOutput } from '../../../src/matching-algo/data-model/output-model/IGitProjectOutput';
import { DjangoMatcher } from '../../../src/matching-algo/matcher/Python/DjangoMatcher';
import { PythonMatcher } from '../../../src/matching-algo/matcher/Python/PythonMatcher';

// Setup Language Matcher with Python and django
const djangoMatcher: AbstractFrameworkMatcher = new DjangoMatcher();
const pythonMatcher: AbstractLanguageMatcher = new PythonMatcher();

pythonMatcher.addFramework(djangoMatcher);

const customLanguageMatchers: AbstractLanguageMatcher[] = [pythonMatcher];

describe('Test Django matching algorithm', () => {
  it('Should return the correct output object', () => {
    // GIVEN
    const client: MatcherClient = new MatcherClient(
      dataEntry,
      customLanguageMatchers
    );

    // WHEN
    const computedOutput: IGitProjectSummary = client.execute();

    // THEN
    let index: number = 0;
    for (const proj in computedOutput.projectsOutput) {
      const projectSum: IGitProjectOutput = projectOutput.projectsOutput[index];
      const computedProjectSum: IGitProjectOutput =
        computedOutput.projectsOutput[index];
      index++;
      if (JSON.stringify(projectSum) !== JSON.stringify(computedProjectSum)) {
        console.log('expected : ' + JSON.stringify(projectSum));
        console.log('actual: ' + JSON.stringify(computedProjectSum));
        expect.fail();
      }
    }
  });
});
