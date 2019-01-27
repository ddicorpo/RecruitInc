import * as React from 'react';
import { shallow } from 'enzyme';

import Header from '../../src/app/components/Header';

it('Header as page link ', () => {
  const result: boolean = shallow(<Header />).containsAnyMatchingElements([
    <a href="index.tml" />,
  ]);
});
