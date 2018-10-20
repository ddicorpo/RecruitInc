import { expect } from "chai";
import 'mocha';
import {dataEntry} from "../data-model/GitProjectInputExample"
import { projectOutput } from "../data-model/GitProjectOutputExample"
import { IGitProjectOutput } from "../../../src/matching-algo/data-model/output-model/IGitProjectOutput";
import { Technologies } from "../../../src/matching-algo/data-model/output-model/Technologies";
import {MatcherClient} from "../../../src/matching-algo/matcher-client/MatcherClient";
describe('Test react matching algorithm', () => {

    it('Should return the correct output object', () => {
        // GIVEN
        const client: MatcherClient = new MatcherClient(dataEntry);

        // WHEN
        const computedOutput: IGitProjectOutput[] = client.execute();

        // THEN
        console.log("COMPUTED OUTPUT: ", JSON.stringify(computedOutput));
        console.log("EXPECTED OUTPUT: ", JSON.stringify(projectOutput));
        expect(JSON.stringify(computedOutput)).to.be.equal(JSON.stringify([projectOutput]));
    });

});

