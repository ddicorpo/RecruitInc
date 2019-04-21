import * as React from 'react';
import { ChatMessage } from './ChatMessage';
import '../assets/css/chat.css';

export interface ChatMessagesProps {
  chatId: string; // this chat id
  messages: Array<ChatMessage>; // initial chat messages
}

class ChatMessages extends React.Component<ChatMessagesProps, any> {
  refs: {
    divContainerMessage: HTMLDivElement;
  };

  scrollToBottom = () => {
    const messagesContainer = this.refs.divContainerMessage;
    messagesContainer.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  };

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    return (
      <div ref="divContainerMessage" id="log">
        {this.props.messages.map(message => {
          return (
            <div key={message.key}>
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
