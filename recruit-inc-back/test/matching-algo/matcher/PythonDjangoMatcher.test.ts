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
  it('The Django-Python matcher should return the correct output object', () => {
    // GIVEN
    const client: MatcherClient = new MatcherClient(
      dataEntry,
      customLanguageMatchers
    );

    // WHEN
    const computedOutput: IGitProjectSummary = client.execute();

    // THEN
    const length: number = computedOutput.projectsOutput.length;
    for (let index = 0; index < length; ++index) {
      const projectSum: IGitProjectOutput = projectOutput.projectsOutput[index];
      const computedProjectSum: IGitProjectOutput =
        computedOutput.projectsOutput[index];
      if (JSON.stringify(projectSum) !== JSON.stringify(computedProjectSum)) {
        console.log('expected : ' + JSON.stringify(projectSum));
        console.log('actual: ' + JSON.stringify(computedProjectSum));
        expect.fail();
      }
    }
  });

  it('The Django-Python matcher should return the correct output object with django-sample.app repository', () => {
    // GIVEN
    const input = require('./input/django-sample.app.json');
    const expected = require('./expected-output/django-sample.app.out.json');
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

  it('The Django-Python matcher should return the correct output object with django-to-do repository', () => {
    // GIVEN
    const input = require('./input/django-to-do.json');
    const expected = require('./expected-output/django-to-do.out.json');
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

  it('The Django-Python matcher should return the correct output object with django-tutorial repository', () => {
    // GIVEN
    const input = require('./input/django-tutorial.json');
    const expected = require('./expected-output/django-tutorial.out.json');
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

  it('The Django-Python matcher should return the correct output object with mlc repository', () => {
    // GIVEN
    const input = require('./input/mlc.json');
    const expected = require('./expected-output/mlc.out.json');
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

  it('The Django-Python matcher should return the correct output object with smart-meter-graph repository', () => {
    // GIVEN
    const input = require('./input/smart-meter-graph.json');
    const expected = require('./expected-output/smart-meter-graph-python.out.json');
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

  it('The Django-Python matcher should return the correct output object with tic-tac-toe repository', () => {
    // GIVEN
    const input = require('./input/tic-tac-toe.json');
    const expected = require('./expected-output/tic-tac-toe.out.json');
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
