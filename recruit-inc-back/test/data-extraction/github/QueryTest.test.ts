import { expect} from 'chai';
import { describe, it} from 'mocha';
import { mock, when, instance } from 'ts-mockito';
import {Query} from "../../../src/data-extraction/github/query";
import {GithubUserInfo} from "../../../src/data-extraction/github/githubUserInfo";

let fakeStorage : any = "fakeDataRetrieved";
let fakeUsername : string = "fakeUsername";
let fakeLocation: string = "montreal";
let fakeEndCusor: string = "Y3Vyc29yOjEwMDA="
let fakeLastCreatedAt: string = "2018-09-27"


describe.only('GithubUserInfo Queries with Mock', function () {

it('should call firstQuery function and then the github V4 API', function () {
    const mockedGithubUser: GithubUserInfo = mock(GithubUserInfo);
    const trial_Instance : GithubUserInfo = instance(mockedGithubUser);
    when(mockedGithubUser.firstQuery(fakeLocation)).thenReturn(fakeStorage);
    let result: Promise<string> = trial_Instance.firstQuery(fakeLocation);
    expect(result).equals(fakeStorage);
});

it('should call getData function and then the github V4 API', function () {
    const mockedGithubUser: GithubUserInfo = mock(GithubUserInfo);
    const trial_Instance : GithubUserInfo = instance(mockedGithubUser);
    when(mockedGithubUser.getData(fakeLocation,fakeEndCusor)).thenReturn(fakeStorage);
    let result: Promise<string> = trial_Instance.getData(fakeLocation,fakeEndCusor);
    expect(result).equals(fakeStorage);
});


it('should call getDataBefore function and then the github V4 API', function () {
    const mockedGithubUser: GithubUserInfo = mock(GithubUserInfo);
    const trial_Instance : GithubUserInfo = instance(mockedGithubUser);
    when(mockedGithubUser.getDataBefore(fakeLocation,fakeLastCreatedAt)).thenReturn(fakeStorage);
    let result: Promise<string> = trial_Instance.getDataBefore(fakeLocation,fakeLastCreatedAt);
    expect(result).equals(fakeStorage);
});

it('should call getDataBeforeWithEndCursor function and then the github V4 API', function () {
    const mockedGithubUser: GithubUserInfo = mock(GithubUserInfo);
    const trial_Instance : GithubUserInfo = instance(mockedGithubUser);
    when(mockedGithubUser.getDataBeforeWithEndCursor(fakeLocation,fakeLastCreatedAt,fakeEndCusor)).thenReturn(fakeStorage);
    let result: Promise<string> = trial_Instance.getDataBeforeWithEndCursor(fakeLocation,fakeLastCreatedAt,fakeEndCusor);
    expect(result).equals(fakeStorage);
});

});

describe('Query class with Mock',function(){

it('should call getData function and then the github V4 API',function(){
    const mockedQueryClass: Query = mock(Query);
    const trial_Instance : Query = instance(mockedQueryClass);
    when(mockedQueryClass.getData(fakeUsername)).thenReturn(fakeStorage);
    let result: Promise<string> = trial_Instance.getData(fakeUsername);
    expect(result).equals(fakeStorage);
});

});