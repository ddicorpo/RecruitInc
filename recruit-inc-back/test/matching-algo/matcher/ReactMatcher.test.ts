import { expect } from "chai";
import 'mocha';
import {IProcessedSourceFile, ReactMatcher} from "../../../src/matching-algo/matcher/ReactMatcher";
import {dataEntry} from "../data-model/GitProjectInputExample"
import { projectOutput } from "../data-model/GitProjectOutputExample"
import { IGitProjectOutput } from "../../../src/matching-algo/data-model/output-model/IGitProjectOutput";
import { Technologies } from "../../../src/matching-algo/data-model/output-model/Technologies";
describe('Test react matching algorithm', () => {

    it('Should return the correct output object', () => {
        // GIVEN
        const reactMatcher: ReactMatcher = new ReactMatcher(dataEntry, Technologies.React);

        // WHEN

        const computedOutput: IGitProjectOutput[] = reactMatcher.execute();
        // THEN
        console.log("COMPUTED OUTPUT: ", JSON.stringify(computedOutput));
        console.log("EXPECTED OUTPUT: ", JSON.stringify(projectOutput));
        expect(JSON.stringify(computedOutput)).to.be.equal(JSON.stringify([projectOutput]));
    });

});

