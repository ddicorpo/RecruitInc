import { expect } from 'chai';
import 'mocha';
import { dataEntry } from '../data-model/javascript-example/GitProjectInputExample';
import { projectOutput } from '../data-model/javascript-example/GitProjectOutputExample';
import { MatcherClient } from '../../../src/matching-algo/matcher-client/MatcherClient';
import { AbstractLanguageMatcher } from '../../../src/matching-algo/matcher/AbstractLanguageMatcher';
import { AbstractFrameworkMatcher } from '../../../src/matching-algo/matcher/AbstractFrameworkMatcher';
import { TypescriptMatcher } from '../../../src/matching-algo/matcher/Javascript/TypescriptMatcher';
import { JavascriptMatcher } from '../../../src/matching-algo/matcher/Javascript/JavascriptMatcher';
import { IGitProjectSummary } from '../../../src/matching-algo/data-model/output-model/IGitProjectSummary';
import { IGitProjectOutput } from '../../../src/matching-algo/data-model/output-model/IGitProjectOutput';
import { VueMatcher } from '../../../src/matching-algo/matcher/Javascript/VueMatcher';

// Setup Language Matcher with only Typescript, Javascript and React
const vueMatcher: AbstractFrameworkMatcher = new VueMatcher();
const typescriptMatcher: AbstractFrameworkMatcher = new TypescriptMatcher();
const javascriptMatcher: AbstractLanguageMatcher = new JavascriptMatcher();
javascriptMatcher.addFramework(typescriptMatcher).addFramework(vueMatcher);
const customLanguageMatchers: AbstractLanguageMatcher[] = [javascriptMatcher];

describe('Test react matching algorithm', () => {
  it('The Vue-Typescript-Javascript matcher should return  the correct output object with vuejs-portfolio repository', () => {
    // GIVEN
    const input = require('./input/vuejs-portfolio.json');
    const expected = require('./expected-output/vuejs-portfolio.out.json');
    const client: MatcherClient = new MatcherClient(
      input,
      customLanguageMatchers
    );

    // WHEN
    const computedOutput: IGitProjectSummary = client.execute();

    // THEN
    let index: number = 0;
    for (const proj in computedOutput.projectsOutput) {
      const computedProjectSum: IGitProjectOutput =
        computedOutput.projectsOutput[index];
      index++;
      if (JSON.stringify(expected) !== JSON.stringify(computedProjectSum)) {
        console.log('expected: ' + JSON.stringify(expected));
        console.log('actual: ' + JSON.stringify(computedProjectSum));
        expect.fail();
      }
    }
  });

  it('The Vue-Typescript-Javascript matcher should return  the correct output object with vue-js-fundamentals repository', () => {
    // GIVEN
    const input = require('./input/vue-js-fundamentals.json');
    const expected = require('./expected-output/vue-js-fundamentals.out.json');
    const client: MatcherClient = new MatcherClient(
      input,
      customLanguageMatchers
    );

    // WHEN
    const computedOutput: IGitProjectSummary = client.execute();

    // THEN
    let index: number = 0;
    for (const proj in computedOutput.projectsOutput) {
      const computedProjectSum: IGitProjectOutput =
        computedOutput.projectsOutput[index];
      index++;
      if (JSON.stringify(expected) !== JSON.stringify(computedProjectSum)) {
        console.log('expected: ' + JSON.stringify(expected));
        console.log('actual: ' + JSON.stringify(computedProjectSum));
        expect.fail();
      }
    }
  });

  it('The Vue-Typescript-Javascript matcher should return  the correct output object with office-ui-fabric-vue repository', () => {
    // GIVEN
    const input = require('./input/office-ui-fabric-vue.json');
    const expected = require('./expected-output/office-ui-fabric-vue.out.json');
    const client: MatcherClient = new MatcherClient(
      input,
      customLanguageMatchers
    );

    // WHEN
    const computedOutput: IGitProjectSummary = client.execute();

    // THEN
    let index: number = 0;
    for (const proj in computedOutput.projectsOutput) {
      const computedProjectSum: IGitProjectOutput =
        computedOutput.projectsOutput[index];
      index++;
      if (JSON.stringify(expected) !== JSON.stringify(computedProjectSum)) {
        console.log('expected: ' + JSON.stringify(expected));
        console.log('actual: ' + JSON.stringify(computedProjectSum));
        expect.fail();
      }
    }
  });
});
