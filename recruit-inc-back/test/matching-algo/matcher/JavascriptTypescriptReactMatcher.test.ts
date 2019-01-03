import { expect } from 'chai';
import 'mocha';
import { dataEntry } from '../data-model/javascript-example/GitProjectInputExample';
import { projectOutput } from '../data-model/javascript-example/GitProjectOutputExample';
import { MatcherClient } from '../../../src/matching-algo/matcher-client/MatcherClient';
import { AbstractLanguageMatcher } from '../../../src/matching-algo/matcher/AbstractLanguageMatcher';
import { AbstractFrameworkMatcher } from '../../../src/matching-algo/matcher/AbstractFrameworkMatcher';
import { ReactMatcher } from '../../../src/matching-algo/matcher/Javascript/ReactMatcher';
import { TypescriptMatcher } from '../../../src/matching-algo/matcher/Javascript/TypescriptMatcher';
import { JavascriptMatcher } from '../../../src/matching-algo/matcher/Javascript/JavascriptMatcher';
import { IGitProjectSummary } from '../../../src/matching-algo/data-model/output-model/IGitProjectSummary';
import { IGitProjectOutput } from '../../../src/matching-algo/data-model/output-model/IGitProjectOutput';

// Setup Language Matcher with only Typescript, Javascript and React
const reactMatcher: AbstractFrameworkMatcher = new ReactMatcher();
const typescriptMatcher: AbstractFrameworkMatcher = new TypescriptMatcher();
const javascriptMatcher: AbstractLanguageMatcher = new JavascriptMatcher();
javascriptMatcher.addFramework(typescriptMatcher).addFramework(reactMatcher);
const customLanguageMatchers: AbstractLanguageMatcher[] = [javascriptMatcher];

describe('Test react matching algorithm', () => {
  it('The React-Typescript-Javascript matcher should return the correct output object with a generic repository', () => {
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
        console.log('expected: ' + JSON.stringify(projectSum));
        console.log('actual: ' + JSON.stringify(computedProjectSum));
        expect.fail();
      }
    }
  });

  it('The React-Typescript-Javascript matcher should return  the correct output object with algo-data-structures repository', () => {
    // GIVEN
    const input = require('./input/algo-data-structures.json');
    const expected = require('./expected-output/algo-data-structures.out.json');
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

  it('The React-Typescript-Javascript matcher should return  the correct output object with circleciprisma repository', () => {
    // GIVEN
    const input = require('./input/circleciprisma.json');
    const expected = require('./expected-output/circleciprisma.out.json');
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

  it('The React-Typescript-Javascript matcher should return  the correct output object with codebuddy-fs repository', () => {
    // GIVEN
    const input = require('./input/codebuddy-fs.json');
    const expected = require('./expected-output/codebuddy-fs.out.json');
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

  it('The React-Typescript-Javascript matcher should return  the correct output object with date-facts repository', () => {
    // GIVEN
    const input = require('./input/date-facts.json');
    const expected = require('./expected-output/date-facts.out.json');
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

  it('The React-Typescript-Javascript matcher should return  the correct output object with droplr-clone repository', () => {
    // GIVEN
    const input = require('./input/droplr-clone.json');
    const expected = require('./expected-output/droplr-clone.out.json');
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

  it('The React-Typescript-Javascript matcher should return  the correct output object with jest repository', () => {
    // GIVEN
    const input = require('./input/jest.json');
    const expected = require('./expected-output/jest.out.json');
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

  it('The React-Typescript-Javascript matcher should return  the correct output object with kankan repository', () => {
    // GIVEN
    const input = require('./input/kankan.json');
    const expected = require('./expected-output/kankan.out.json');
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

  it('The React-Typescript-Javascript matcher should return  the correct output object with pc repository', () => {
    // GIVEN
    const input = require('./input/pc.json');
    const expected = require('./expected-output/pc.out.json');
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

  it('The React-Typescript-Javascript matcher should return  the correct output object with pineapplol repository', () => {
    // GIVEN
    const input = require('./input/pineapplol.json');
    const expected = require('./expected-output/pineapplol.out.json');
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

  it('The React-Typescript-Javascript matcher should return  the correct output object with react-ecommerce repository', () => {
    // GIVEN
    const input = require('./input/react-ecommerce.json');
    const expected = require('./expected-output/react-ecommerce.out.json');
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

  it('The React-Typescript-Javascript matcher should return  the correct output object with rickety repository', () => {
    // GIVEN
    const input = require('./input/rickety.json');
    const expected = require('./expected-output/rickety.out.json');
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

  it('The React-Typescript-Javascript matcher should return  the correct output object with sekstant repository', () => {
    // GIVEN
    const input = require('./input/sekstant.json');
    const expected = require('./expected-output/sekstant.out.json');
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

  it('The React-Typescript-Javascript matcher should return  the correct output object with smart-meter-graph repository', () => {
    // GIVEN
    const input = require('./input/smart-meter-graph.json');
    const expected = require('./expected-output/smart-meter-graph-react.out.json');
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
