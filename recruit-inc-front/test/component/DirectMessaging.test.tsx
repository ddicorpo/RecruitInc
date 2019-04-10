import { shallow } from 'enzyme';
import * as React from 'react';
import DirectMessaging from '../../src/app/pages/DirectMessaging';
import ChatMessages from '../../src/app/components/ChatMessages';
import { ChatMessage } from '../../src/app/components/ChatMessage';

describe('Testing Direct Messaging', () => {
  it('render correctly direct messaging component ', () => {
    const props = {
      appkey: 'wmfGqY',
      token: 'TypeScriptReactExample',
    };
    const wrapper = shallow(<DirectMessaging {...props} />);
    const itShallContains: boolean = wrapper.contains('Direct Messaging');
    expect(wrapper.exists()).toBe(true);
    expect(itShallContains).toBe(true);
  });

  it('render correctly Chat message component ', () => {
    const props = {
      chatId: '55',
      messages: Array<ChatMessage>(),
    };

    const wrapper = shallow(<ChatMessages {...props} />);
    expect(wrapper.exists()).toBe(true);
  });
});
