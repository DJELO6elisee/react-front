// src/components/ChatArea/MessageList.js
import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
// usersData n'est plus importé ici car les infos sender viennent avec le message
import './MessageList.css';

const MessageList = ({ messages, currentUserId, activeRoomId }) => { // activeRoomId ajouté en prop
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Si aucun salon n'est actif, ne rien afficher ou un placeholder pour MessageList
  if (!activeRoomId) {
    return (
        <div className="message-list empty" style={{ justifyContent: 'center', alignItems: 'center', height: '100%'}}>
            <p>Sélectionnez un salon pour commencer à discuter.</p>
        </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
        <div className="message-list empty">
            Aucun message dans ce salon. Soyez le premier à envoyer un message !
        </div>
    );
  }

  return (
    <div className="message-list">
      {messages.map(msg => (
        <MessageItem
          key={msg.id}
          message={msg} // msg contient text, timestamp, roomId
          // Les infos de l'expéditeur sont maintenant dans l'objet msg
          sender={{ 
            name: msg.sender_username, // Doit correspondre à ce que le backend envoie
            avatarUrl: msg.sender_avatar_url, // Doit correspondre
            id: msg.sender_id 
          }}
          isOwnMessage={msg.sender_id === currentUserId}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;