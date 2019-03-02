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
    const wrapper = shallow(<CandidateSearch />);
    const labelCandidate = <h2 className="header-title">Candidate Search</h2>;
    const labelFilters = <h4 className="card-title">Search Filters</h4>;
    const labelLanguage = (
      <label className="control-label">Language Search</label>
    );
    const labelCity = <label className="control-label">City Search</label>;
    const labelResults = <h4 className="card-title">Results</h4>;
    const isLabelLanguageInside = wrapper.contains(labelLanguage);
    const isLabelCandidateInside = wrapper.contains(labelCandidate);
    const isLabelFiltersInside = wrapper.contains(labelFilters);
    const isLabelCityInside = wrapper.contains(labelCity);
    const isLabelResults = wrapper.contains(labelResults);
    expect(isLabelCandidateInside).toBe(true);
    expect(isLabelFiltersInside).toBe(true);
    expect(isLabelLanguageInside).toBe(true);
    expect(isLabelCityInside).toBe(true);
    expect(isLabelResults).toBe(true);
  });
});
