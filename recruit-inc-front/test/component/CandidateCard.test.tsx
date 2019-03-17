import { LocationWatch } from '../../src/app/model/Location/LocationWatch';
import { CandidateCard } from '../../src/app/components/CandidateCard';
import { shallow } from 'enzyme';
import * as React from 'react';
import { ICardProps } from '../../src/app/components/CandidateCard';
import renderer from 'react-test-renderer';

const JSONimport = require('../samples/FakeCandidateCard.json');
describe.only('CandidateCard Component Testing', () => {
  it('Testing Component with data', () => {
    const fakeCandidateCard: CandidateCard = new CandidateCard('bob');
    const fakeProps: ICardProps = {
      userInfo: JSONimport,
      projectInfo: JSONimport.projectSummary,
    };
    const props = {
      userInfo: JSONimport,
      projectInfo: JSONimport.projectSummary,
    };

    const wrapper = shallow(<CandidateCard {...props} />);
    const itShallContains: boolean = wrapper.contains(JSONimport.email);
    expect(itShallContains).toBe(true);
  });

  /*it('Testing Component full list', () => {
    const fakeWatchLocation: LocationWatch = new LocationWatch('bob', 200, 200);
    const props = {
      locationWatchData: fakeWatchLocation,
    };

    const wrapper = shallow(<CandidateCard  {...props} />);
    const itShallContains: boolean = wrapper.contains('Finished');
    expect(itShallContains).toBe(true);
  });

  it('Testing Component non-full list', () => {
    const fakeWatchLocation: LocationWatch = new LocationWatch('bob', 200, 20);
    const props = {
      locationWatchData: fakeWatchLocation,
    };

    const wrapper = shallow(<CandidateCard  {...props} />);
    const itShallContains: boolean = wrapper.contains('Running');
    expect(itShallContains).toBe(true);
  });

  it('render correctly the CandidateCard  component', () => {
    const fakeWatchLocation: LocationWatch = new LocationWatch('rena', 270, 20);
    const props = {
      locationWatchData: fakeWatchLocation,
    };
    const wrapper = renderer.create(<CandidateCard {...props} />).toJSON();
    expect(wrapper).toMatchSnapshot();
  });*/
});
