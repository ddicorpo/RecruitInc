import * as React from 'react';
import * as Realtime from 'realtime-messaging';
import { ChatMessage } from '../components/ChatMessage';

import MessageInput from '../components/MessageInput';
import ChatMessages from '../components/ChatMessages';

export interface ChatProps {
  appkey: string; // Realtime Messaging application key
  token: string; // Security token
}

// The component state is an array of ChatMessages
interface ChatState {
  messages: Array<ChatMessage>;
}
class DirectMessaging extends React.Component<ChatProps, ChatState> {
  realtime: Realtime.Client; // the Realtime connection
  channel: string; // the chat Realtime pub/sub channel
  ID: string; // the user random ID to use as nickname and subscriberId

  constructor(props: ChatProps) {
    super(props);

    this.channel = 'chat';
    this.ID = 'ID_' + Math.floor(Math.random() * 1000 + 1);
    this.state = {
      messages: [],
    };
  }

  componentWillMount() {
    // Establish a Realtime connection
    this.realtime = Realtime.createClient();
    this.realtime.setClusterUrl(
      'http://ortc-developers.realtime.co/server/2.1/'
    );
    this.realtime.connect(
      this.props.appkey,
      this.props.token
    );

    // setup event handlers
    this.realtime.onConnected = this.onRealtimeConnected.bind(this);
    this.realtime.onException = this.onRealtimeException;
  }

  componentWillUnmount() {
    if (this.realtime) {
      // disconnect from Realtime
      this.realtime.disconnect();
    }
  }

  // Realtime connection is established
  onRealtimeConnected(client: Realtime.Client) {
    console.log('Realtime connected. Subscribing with subscriberId', this.ID);
    // subscribe the chat channel to receive messages
    client.subscribeWithBuffer(
      this.channel,
      this.ID,
      this.onRealtimeChatMessage.bind(this)
    );
  }

  // A new message was received in the chat Realtime channel
  onRealtimeChatMessage(
    client: Realtime.Client,
    channel: string,
    seqId: string,
    message: string
  ) {
    console.log('Received message with seqId:', seqId);

    // parse the chat message
    const parsedMessage: any = JSON.parse(message);

    // add the received message to the chat messages list
    // key must be unique, so we're using the current message count and not the message key property
    const chatMessage: ChatMessage = {
      key: this.state.messages.length,
      id: parsedMessage.id,
      text: parsedMessage.text,
      sentAt: parsedMessage.sentAt,
    };

    this.addMessage(chatMessage);
  }

  // Adds a new chat message to the chat message list
  addMessage(message: ChatMessage) {
    this.setState(prevState => {
      // React works better with immutable object, so let's create a new array
      const newArray: Array<ChatMessage> = prevState.messages.slice(0);

      // push the new message to the new array
      newArray.push({
        ...message,
      });

      // return the new state
      return {
        messages: newArray,
      };
    });
  }

  // A Realtime exception ocourred
  onRealtimeException(client: Realtime.Client, exception: string) {
    console.log('Realtime Exception:', exception);
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="page-header">
          <h2 className="header-title">Direct Messaging</h2>
        </div>

        <div>
          <MessageInput
            realtime={this.realtime}
            channel={this.channel}
            chatId={this.ID}
          />
          <ChatMessages chatId={this.ID} messages={this.state.messages} />
        </div>
      </div>
    );
  }
}

export default DirectMessaging;
