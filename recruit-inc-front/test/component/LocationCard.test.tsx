import { LocationWatch } from '../../src/app/model/Location/LocationWatch';
import { LocationCard } from '../../src/app/components/Location/LocationCard';
import { shallow } from 'enzyme';
import * as React from 'react';
import renderer from 'react-test-renderer';

describe('LocationCard Component Testing', () => {
  it('Testing Component with data', () => {
    const fakeWatchLocation: LocationWatch = new LocationWatch('bob', 200, 30);
    const props = {
      locationWatchData: fakeWatchLocation,
    };

    const wrapper = shallow(<LocationCard {...props} />);
    const itShallContains: boolean = wrapper.contains(fakeWatchLocation.name);
    expect(itShallContains).toBe(true);
  });

  it('Testing Component full list', () => {
    const fakeWatchLocation: LocationWatch = new LocationWatch('bob', 200, 200);
    const props = {
      locationWatchData: fakeWatchLocation,
    };

    const wrapper = shallow(<LocationCard {...props} />);
    const itShallContains: boolean = wrapper.contains('Finished');
    expect(itShallContains).toBe(true);
  });

  it('Testing Component non-full list', () => {
    const fakeWatchLocation: LocationWatch = new LocationWatch('bob', 200, 20);
    const props = {
      locationWatchData: fakeWatchLocation,
    };

    const wrapper = shallow(<LocationCard {...props} />);
    const itShallContains: boolean = wrapper.contains('Running');
    expect(itShallContains).toBe(true);
  });

  it('render correctly the LocationCard component', () => {
    const fakeWatchLocation: LocationWatch = new LocationWatch('rena', 270, 20);
    const props = {
      locationWatchData: fakeWatchLocation,
    };
    const wrapper = renderer.create(<LocationCard {...props} />).toJSON();
    expect(wrapper).toMatchSnapshot();
  });
});
