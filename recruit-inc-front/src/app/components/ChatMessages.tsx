import * as React from 'react';
import { ChatMessage } from './ChatMessage';

export interface ChatMessagesProps {
  chatId: string; // this chat id
  messages: Array<ChatMessage>; // initial chat messages
}

class ChatMessages extends React.Component<ChatMessagesProps, any> {
  render() {
    return (
      <div id="log">
        <p>here it will be the rendering of the message</p>
        {this.props.messages.map(message => {
          const msgAlign = message.id === this.props.chatId ? 'right' : 'left';
          return (
            <div key={message.key} className={'blockquote-' + msgAlign}>
              {message.text}
              <br />
              <span className="time">{message.sentAt}</span>
            </div>
          );
        })}
      </div>
    );
  }
}

export default ChatMessages;
