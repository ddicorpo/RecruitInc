import { expect } from 'chai';
import { Examples } from '../src/routes/examples';
import { mock, when, instance } from 'ts-mockito';

describe('Compute with Mock', function() {
  it('MockAddition', function() {
    let mockedExample: Examples = mock(Examples);
    when(mockedExample.sum(5, 2)).thenReturn(7);
    let instanceExample = instance(mockedExample);
    let result = instanceExample.sum(5, 2);
    expect(result).equal(7);
  });
});
