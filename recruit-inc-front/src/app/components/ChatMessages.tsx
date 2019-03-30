import * as React from 'react';
import { ChatMessage } from './ChatMessage';
import '../assets/css/chat.css';

export interface ChatMessagesProps {
  chatId: string; // this chat id
  messages: Array<ChatMessage>; // initial chat messages
}

class ChatMessages extends React.Component<ChatMessagesProps, any> {
  render() {
    return (
      <div id="log">
        {this.props.messages.map(message => {
          const msgAlign = message.id === this.props.chatId ? 'right' : 'left';
          return (
            <div key={message.key} className={'blockquote-' + msgAlign}>
              <p id="nickname"> {message.id} </p>
              <div className="chatter">
                {message.text}
                <p className="timeLocation"> {message.sentAt}</p>
              </div>
              <br />
            </div>
          );
        })}
      </div>
    );
  }
}

export default ChatMessages;
