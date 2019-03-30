import * as React from 'react';
import * as Realtime from 'realtime-messaging';
import { ChatMessage } from './ChatMessage';

export interface MessageInputProps {
  realtime: Realtime.Client;
  chatId: string;
  channel: string;
}

class MessageInput extends React.Component<MessageInputProps, any> {
  refs: {
    msgInput: HTMLInputElement;
  };

  sendMessage() {
    // setup the new message instance
    const message: ChatMessage = {
      key: 0,
      id: this.props.chatId,
      text: this.refs.msgInput.value,
      sentAt: new Date().toLocaleTimeString(),
    };

    // publish message into the chat channel
    const ttl = 2 * 60; // 2 min
    this.props.realtime.publish(
      this.props.channel,
      JSON.stringify(message),
      ttl,
      (err, seqId) => {
        if (err) {
          console.log('Error publishing message:', err);
        } else {
          console.log('Message successfully published. SeqID:', seqId);
        }
      }
    );

    // clear input field
    this.refs.msgInput.value = '';
  }

  onEnter(e: any) {
    if (e.nativeEvent.keyCode !== 13) return;
    e.preventDefault();
    this.sendMessage();
  }

  render() {
    return (
      <div>
        <input
          ref="msgInput"
          type="text"
          className="materialize-input msgInput"
          placeholder="Enter your message"
          onKeyPress={this.onEnter.bind(this)}
        />{' '}
        {'    '}
        <button
          className="btn waves-effect waves-light"
          type="submit"
          name="action"
          onClick={this.sendMessage.bind(this)}
        >
          Send Message
        </button>
      </div>
    );
  }
}

export default MessageInput;
