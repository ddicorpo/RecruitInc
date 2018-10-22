import { expect } from "chai";
import 'mocha';
import {dataEntry} from "../data-model/GitProjectInputExample"
import { projectOutput } from "../data-model/GitProjectOutputExample"
import { IGitProjectOutput } from "../../../src/matching-algo/data-model/output-model/IGitProjectOutput";
import {MatcherClient} from "../../../src/matching-algo/matcher-client/MatcherClient";
import {AbstractLanguageMatcher} from "../../../src/matching-algo/matcher/AbstractLanguageMatcher";
import {AbstractFrameworkMatcher} from "../../../src/matching-algo/matcher/AbstractFrameworkMatcher";
import {ReactMatcher} from "../../../src/matching-algo/matcher/Javascript/ReactMatcher";
import {TypescriptMatcher} from "../../../src/matching-algo/matcher/Javascript/TypescriptMatcher";
import {JavascriptMatcher} from "../../../src/matching-algo/matcher/Javascript/JavascriptMatcher";
describe('Test react matching algorithm', () => {

    it('Should return the correct output object', () => {
        // GIVEN
        // Setup Language Matcher with only Typescript, Javascript and React
        const reactMatcher: AbstractFrameworkMatcher = new ReactMatcher();
        const typescriptMatcher: AbstractFrameworkMatcher = new TypescriptMatcher();
        const javascriptMatcher: AbstractLanguageMatcher = new JavascriptMatcher();
        javascriptMatcher.addFramework(typescriptMatcher).addFramework(reactMatcher);
        const customLanguageMatchers: AbstractLanguageMatcher[] = [
            javascriptMatcher
        ];
        const client: MatcherClient = new MatcherClient(dataEntry, customLanguageMatchers);

        // WHEN
        const computedOutput: IGitProjectOutput[] = client.execute();

        // THEN
        expect(JSON.stringify(computedOutput)).to.be.equal(JSON.stringify([projectOutput]));
    });

});

