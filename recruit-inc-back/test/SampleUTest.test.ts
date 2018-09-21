import { expect } from 'chai';
import { Examples }  from '../src/routes/examples';
import {} from 'mocha'

describe('Compute Sum', function () {
    it('add', function () {
        var tmp = new Examples()
        let result = tmp.sum(5, 2);
        expect(result).equal(7);
    });
});