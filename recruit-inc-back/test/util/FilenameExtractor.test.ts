import { expect } from 'chai';
import 'mocha';
import { FilenameExtractor } from '../../src/util/FilenameExtractor';

describe('Test filename extractor', () => {
  it('Should extract properly a filename with the extension out of a simple path', () => {
    // GIVEN
    const path: string = 'toto/tata/titi/tutu/filename.extension';

    // WHEN
    const filename = FilenameExtractor.extract(path);
    // THEN
    expect(filename).to.be.equal('filename.extension');
  });
});
