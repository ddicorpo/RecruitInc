import { expect } from 'chai';
import { Examples } from '../src/routes/examples';

describe('calculate', function() {
  it('add', function() {
    var tmp = new Examples();
    let result = tmp.sum(5, 2);
    expect(result).equal(7);
  });
});
