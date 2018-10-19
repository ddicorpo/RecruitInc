import { expect } from "chai";
import 'mocha';
import {ReactMatcher} from "../../../src/matching-algo/matcher/ReactMatcher";
import {dataEntry} from "../data-model/GitProjectInputExample"
import { projectOutput } from "../data-model/GitProjectOutputExample"
import { IGitProjectOutput } from "../../../src/matching-algo/data-model/output-model/IGitProjectOutput";
describe('Test react matching algorithm', () => {

    it('Should return the correct output object', () => {
        // GIVEN
        const reactMatcher: ReactMatcher = new ReactMatcher(dataEntry);

        // WHEN
        const computedOutput: IGitProjectOutput = reactMatcher.execute();
        // THEN
        expect(JSON.stringify(computedOutput) === JSON.stringify(projectOutput));
    });


    it('Should detect whether a person has made commits in react', () => {
        // GIVEN
        const reactMatcher: ReactMatcher = new ReactMatcher(dataEntry);

        // WHEN
        const isReactFound: boolean = reactMatcher.isReactFound();

        // THEN
        // We expect to find react in our dataEntry object
        expect(isReactFound);
    });

});

