
import  { Examples }  from '../src/routes/examples';
import { expect } from 'chai';
import 'mocha';
describe('Test Sum function', () => {

    it('should return correct sum', () => {
        var tmp = new Examples()
        const result = tmp.sum(1, 4)
        expect(result).to.equal(5);
    });

});
describe('Failing Test Sum function', () => {

    it('should return correct sum', () => {
        var tmp = new Examples()
        const result = tmp.sum(1, 4)
        expect(result).to.equal(6);
    });

});