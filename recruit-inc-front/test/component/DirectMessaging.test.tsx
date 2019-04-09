import { shallow } from 'enzyme';
import * as React from 'react';
import DirectMessaging from '../../src/app/pages/DirectMessaging';
/* import MessageInput from 'src/app/components/MessageInput';
import * as Realtime from 'realtime-messaging'; */
import ChatMessages from '../../src/app/components/ChatMessages';
import { ChatMessage } from '../../src/app/components/ChatMessage';

describe.only('Testing Direct Messaging', () => {
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

  it('render correctly direct messaging component ', () => {
    const props = {
      chatId: '55',
      messages: Array<ChatMessage>(),
    };

    const wrapper = shallow(<ChatMessages {...props} />);
    expect(wrapper.exists()).toBe(true);
  });
});
