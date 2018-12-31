import { expect } from 'chai';
import 'mocha';
import { MatcherClient } from '../../../src/matching-algo/matcher-client/MatcherClient';
import { AbstractLanguageMatcher } from '../../../src/matching-algo/matcher/AbstractLanguageMatcher';
import { AbstractFrameworkMatcher } from '../../../src/matching-algo/matcher/AbstractFrameworkMatcher';
import { TypescriptMatcher } from '../../../src/matching-algo/matcher/Javascript/TypescriptMatcher';
import { JavascriptMatcher } from '../../../src/matching-algo/matcher/Javascript/JavascriptMatcher';
import { IGitProjectSummary } from '../../../src/matching-algo/data-model/output-model/IGitProjectSummary';
import { IGitProjectOutput } from '../../../src/matching-algo/data-model/output-model/IGitProjectOutput';
import { AngularMatcher } from '../../../src/matching-algo/matcher/Javascript/AngularMatcher';

// Setup Language Matcher with only Typescript, Javascript and Angular
const angularMatcher: AbstractFrameworkMatcher = new AngularMatcher();
const typescriptMatcher: AbstractFrameworkMatcher = new TypescriptMatcher();
const javascriptMatcher: AbstractLanguageMatcher = new JavascriptMatcher();
javascriptMatcher.addFramework(typescriptMatcher).addFramework(angularMatcher);
const customLanguageMatchers: AbstractLanguageMatcher[] = [javascriptMatcher];

describe('Test angular matching algorithm', () => {
  it('The Angular-Typescript-Javascript matcher should return the correct output object with kama-angularjs-module repository', () => {
    // GIVEN
    const input = require('./input/kama-angularjs-module.json');
    const expected = require('./expected-output/kama-angularjs-module.out.json');
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

  it('The Angular-Typescript-Javascript matcher should return  the correct output object with portfolio repository', () => {
    // GIVEN
    const input = require('./input/portfolio.json');
    const expected = require('./expected-output/portfolio.out.json');
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

  it('The Angular-Typescript-Javascript matcher should return  the correct output object with instagram-angular repository', () => {
    // GIVEN
    const input = require('./input/instagram-angular.json');
    const expected = require('./expected-output/instagram-angular.out.json');
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
