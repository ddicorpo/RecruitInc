import * as React from 'react';
import { shallow, mount } from 'enzyme';

import SideNavigationBar from '../../src/app/components/SideNavigationBar';
import SideNavigationItem from '../../src/app/components/SideNavigationItem';
import { Pages } from '../../src/app/pages/Pages';
// You might have complains from your IDE if you are using VSCODE
describe('Side Navigation UI Test', () => {
  it('Navigation is rendering', () => {
    shallow(<SideNavigationBar />);
  });
  it('Navigation Item Renders ', () => {
    const result: boolean = shallow(
      <SideNavigationBar />
    ).containsAnyMatchingElements([<SideNavigationItem />]);
    expect(result).toBeTruthy();
  });

  it('Navigation, props link test', () => {
    const onClick = jest.fn();
    let wrapper = mount(
      <SideNavigationItem
        menuTitle={Pages.CANDIDATE_SEARCH}
        iconClass="mdi mdi-magnify"
        handleSidebarClick={onClick}
      />
    );
    wrapper
      .find('a.dropdown-toggle')
      .first()
      .simulate('click');
    expect(onClick).toBeCalled();
  });
});
