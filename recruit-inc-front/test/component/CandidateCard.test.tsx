//import { LocationWatch } from '../../src/app/model/Location/LocationWatch';
import { CandidateCard } from '../../src/app/components/CandidateCard';
import { shallow } from 'enzyme';
import * as React from 'react';
import { CandidateAdapter } from '../../src/app/adapter/CandidateAdapter';
import { ICandidate } from 'src/app/model/Candidate/ICandidate';
//import { ICardProps } from '../../src/app/components/CandidateCard';
//mport renderer from 'react-test-renderer';

const JSONimport = require('../samples/FakeCandidateCard.json');
describe.only('CandidateCard Component Testing', () => {
  const adapter: CandidateAdapter = new CandidateAdapter();
  const results: ICandidate[] = adapter.adapt(JSONimport);
  it('Testing Email for Candidate Component with data', () => {
    const email: string = results[0].email ? results[0].email : ' ';
    const props = {
      userInfo: results[0],
      projectInfo: results[0].projectSummary,
    };
    //const fakeCandidateCard: CandidateCard = new CandidateCard('bob');
    /*const fakeProps: ICardProps = {
      userInfo: JSONimport,
      projectInfo: JSONimport.projectSummary,
    };*/

    /*const props = {
      userInfo: JSONimport,
      projectInfo: JSONimport.projectSummary,
    };*/

    const wrapper = shallow(<CandidateCard {...props} />);
    const itShallContains: boolean = wrapper.contains(email);
    expect(itShallContains).toBe(true);
  });

  it('Testing email for Candidate', () => {
    const username: string = results[0].username ? results[0].username : ' ';
    const props = {
      userInfo: results[0],
      projectInfo: results[0].projectSummary,
    };
    //const fakeCandidateCard: CandidateCard = new CandidateCard('bob');
    /*const fakeProps: ICardProps = {
      userInfo: JSONimport,
      projectInfo: JSONimport.projectSummary,
    };*/

    /*const props = {
      userInfo: JSONimport,
      projectInfo: JSONimport.projectSummary,
    };*/

    const wrapper = shallow(<CandidateCard {...props} />);
    const itShallContains: boolean = wrapper.contains(username);
    expect(itShallContains).toBe(true);
  });
});
