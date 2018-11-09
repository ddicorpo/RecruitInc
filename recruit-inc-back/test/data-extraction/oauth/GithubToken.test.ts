import { expect } from 'chai';
import { GithubToken } from '../../../src/data-extraction/github/GithubToken';

describe('GithubToken class', function() {
  it('Should build the param string properly', function() {
    const code = '123';

    let expected: string = GithubToken.buildParam(code);
    let actual: string =
      'https://github.com/login/oauth/access_token?client_id=1908c6dc58ef2187341f&client_secret=6bfae547289c1d3da3fa37df655d4aa02502b9ad&code=123';
    expect(expected).to.equal(actual);
  });
});
