import * as React from 'react';
import { shallow } from 'enzyme';
import CandidateSearch from '../../src/app/pages/CandidateSearch';

// You might have complains from your IDE if you are using VSCODE
describe('Candidate Search Page', () => {
  /**
   * For this page we will need to mock the data return by the fetch functions
   */
  it('Candidate Search Page Rendering ', () => {
    //fetch.mockResponses(JSON.stringify(candidatesJSON));
    shallow(<CandidateSearch />);
  });
});
