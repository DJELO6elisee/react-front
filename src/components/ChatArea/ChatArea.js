// src/components/ChatArea/ChatArea.js
import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import './ChatArea.css';

const ChatArea = ({ activeRoom, messages, currentUserId, onSendMessage }) => {
  return (
    <main className="chat-area">
      <ChatHeader activeRoom={activeRoom} />
      <MessageList messages={messages} currentUserId={currentUserId} />
      {activeRoom && <MessageInput onSendMessage={onSendMessage} />}
    </main>
  );
};

export default ChatArea;