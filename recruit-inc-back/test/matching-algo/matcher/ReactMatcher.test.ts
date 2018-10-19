import { expect } from "chai";
import 'mocha';
import {ReactMatcher} from "../../../src/matching-algo/matcher/ReactMatcher";
import {dataEntry} from "../data-model/GitProjectInputExample"
import { projectOutput } from "../data-model/GitProjectOutputExample"
import { IGitProjectOutput } from "../../../src/matching-algo/data-model/output-model/IGitProjectOutput";
describe('Test react matching algorithm', () => {

    it('should return correct sum', () => {
        // GIVEN
        const reactMatcher: ReactMatcher = new ReactMatcher(dataEntry);


        // WHEN
        var computedOutput: IGitProjectOutput = reactMatcher.execute();
        // THEN
        expect(JSON.stringify(computedOutput) === JSON.stringify(projectOutput));
    });

});

