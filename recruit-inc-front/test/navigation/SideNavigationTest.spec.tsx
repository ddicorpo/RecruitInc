import * as React from 'react';
import { shallow } from 'enzyme';

import SideNavigationBar from '../../src/app/components/SideNavigationBar';
import SideNavigationItem from '../../src/app/components/SideNavigationItem';

// You might have complains from your IDE if you are using VSCODE
describe('Side Navigation UI Test', () => {
  /**
   * This test is a sample UI Test... on static element
   */
  it('Side Navigation Bar has Navigation Item ', () => {
    const result: boolean = shallow(
      <SideNavigationBar />
    ).containsAnyMatchingElements([<SideNavigationItem />]);
    expect(result).toBeTruthy();
  });
});
