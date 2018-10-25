import { expect } from "chai";
import 'mocha';
import {ExtensionExtractor} from "../../src/util/ExtensionExtractor";

describe('Test extension extractor', () => {

    it('Should extract properly an extension out of a simple path', () => {
        // GIVEN
        const path: string = "toto/tata/titi/tutu/filename.extension";

        // WHEN
        const extension = ExtensionExtractor.extract(path);
        // THEN
        expect(extension).to.be.equal("extension");
    });


    it('Should extract properly an extension out of a file name', () => {
        // GIVEN
        const filename: string = "filename.extension";

        // WHEN
        const extension = ExtensionExtractor.extract(filename);
        // THEN
        expect(extension).to.be.equal("extension");
    });


});

