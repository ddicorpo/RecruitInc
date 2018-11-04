import { expect } from "chai";
import 'mocha';
import {IntersectionArrayString} from "../../src/util/IntersectionArrayString";

describe('Test intersection function', () => {

    it('Should find similar term in array', () => {
        // GIVEN
        const dataArray: string[] = ["bob", "Mage", "marcel", "dog"];
        const dataArrayWithSameTerm : string[] = ["bob", "duck", "marcel"];
        // WHEN
        const resutls : string[] = IntersectionArrayString.intersection(dataArray, dataArrayWithSameTerm);
        const expectedResults : string[] = ["bob", "marcel"];
        // THEN
        expect(resutls.toString()).to.be.equal(expectedResults.toString());
    });


});