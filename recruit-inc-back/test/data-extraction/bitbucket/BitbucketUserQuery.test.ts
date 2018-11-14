import { expect } from 'chai';
import { BitbucketApi2 } from '../../../src/data-extraction/bitbucket/bitbucketApi2';

const testQuery :BitbucketApi2 = new BitbucketApi2();


describe('Test Generated Path Bitbucket', function () {
    beforeEach(() => {

          });


    it('should return a proper generated path', function () {
        let expected = "downloaded/23jams/bitbucket/repoName/test.txt";
        let actual = testQuery.generatePath("23jams", "repoName", "test.txt");
        expect(expected).to.equal(actual);
    });

});