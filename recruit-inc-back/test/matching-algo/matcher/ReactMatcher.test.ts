import { expect } from 'chai';
import 'mocha';
import {ReactMatcher} from "../../../src/matching-algo/matcher/ReactMatcher";
import {dataEntry} from "../data-model/GitProjectInputExample"


describe('Test react matching algorithm', () => {

    it('should return correct sum', () => {
        // GIVEN
        const reactMatcher: ReactMatcher = new ReactMatcher();
        dataEntry;

        // WHEN

        // THEN
        expect(result).to.equal(5);
    });

});

