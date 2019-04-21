import { CandidateCard } from '../../src/app/components/CandidateCard';
import { shallow } from 'enzyme';
import * as React from 'react';
import { CandidateAdapter } from '../../src/app/adapter/CandidateAdapter';
import { ICandidate } from 'src/app/model/Candidate/ICandidate';

const JSONimport = require('../samples/FakeCandidateCard.json');
describe.only('CandidateCard Component Testing', () => {
  const adapter: CandidateAdapter = new CandidateAdapter();
  const results: ICandidate[] = adapter.adapt(JSONimport);
  xit('Testing Email for Candidate Component with data', () => {
    const email: string = results[0].email ? results[0].email : ' ';
    const props = {
      userInfo: results[0],
      projectInfo: results[0].projectSummary,
    };

    const wrapper = shallow(<CandidateCard {...props} />);
    const itShallContains: boolean = wrapper.contains(email);
    expect(itShallContains).toBe(true);
  });

  xit('Testing email for Candidate', () => {
    const username: string = results[0].username ? results[0].username : ' ';
    const props = {
      userInfo: results[0],
      projectInfo: results[0].projectSummary,
    };

    const wrapper = shallow(<CandidateCard {...props} />);
    const itShallContains: boolean = wrapper.contains(username);
    expect(itShallContains).toBe(true);
  });
});
