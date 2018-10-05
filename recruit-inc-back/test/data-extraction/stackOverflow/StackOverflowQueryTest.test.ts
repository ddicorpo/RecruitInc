
import { expect } from 'chai';
import { describe, it} from 'mocha';
import { mock, when, instance } from 'ts-mockito';
import { StackOverflowAPI } from '../../../src/data-extraction/stackoverflow/stackOverflowAPI'

/**
 * This is an example of mocking... we will use more these test when we
 * are going to parse the json to extract/reject metric
 */

describe('StackOverflow Query with Mock', function () {

    it('Mock API Profile', function () {
        const mockedProfileAPI: StackOverflowAPI = mock(StackOverflowAPI);
        const testedInstance : StackOverflowAPI = instance(mockedProfileAPI);
        when(mockedProfileAPI.queryProfileData("fakeId")).thenReturn("fakeStorage");
        let result: string = testedInstance.queryProfileData("fakeId");
        expect(result).equals("fakeStorage");
    });

    it('Mock API Network', function () {
        const mockedProfileAPI: StackOverflowAPI = mock(StackOverflowAPI);
        const testedInstance: StackOverflowAPI = instance(mockedProfileAPI);
        when(mockedProfileAPI.queryNetworkData("fakeId")).thenReturn("fakeStorage");
        let result: string = testedInstance.queryNetworkData("fakeId");
        expect(result).equals("fakeStorage");
    });
    it('Mock API Badge', function () {
        const mockedProfileAPI: StackOverflowAPI = mock(StackOverflowAPI);
        const testedInstance: StackOverflowAPI = instance(mockedProfileAPI);
        when(mockedProfileAPI.queryBadgesData("fakeId")).thenReturn("fakeStorage");
        let result: string = testedInstance.queryBadgesData("fakeId");
        expect(result).equals("fakeStorage");
    });
});
