// src/components/ChatArea/MessageList.js
import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import { usersData } from '../../data/mockData'; // Pour trouver les infos de l'expéditeur
import './MessageList.css';

const MessageList = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]); // Scroll à chaque nouveau message

  if (!messages || messages.length === 0) {
    return <div className="message-list empty">Aucun message dans ce salon. Commencez la conversation !</div>;
  }

  return (
    <div className="message-list">
      {messages.map(msg => (
        <MessageItem
          key={msg.id}
          message={msg}
          sender={usersData[msg.senderId]}
          isOwnMessage={msg.senderId === currentUserId}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;