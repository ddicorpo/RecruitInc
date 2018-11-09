import { expect } from 'chai';
import 'mocha';
import { FilepathExtractor } from '../../src/util/FilepathExtractor';

describe('Test filepath extractor', () => {
  it('Should extract properly a filepath without containing the filename', () => {
    // GIVEN
    const path: string = 'toto/tata/titi/tutu/filename.extension';

    // WHEN
    const extractedPath = FilepathExtractor.extract(path);
    // THEN
    expect(extractedPath).to.be.equal('toto/tata/titi/tutu/');
  });

  it('Should return an empty string when there is no leading path for a filename', () => {
    // GIVEN
    const path: string = 'package.json';

    // WHEN
    const extractedPath = FilepathExtractor.extract(path);
    // THEN
    expect(extractedPath).to.be.equal('');
  });
});
