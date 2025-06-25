// src/components/ChatArea/MessageList.js
import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import './MessageList.css';

// Ajout des props 'socket' et 'activeRoom'
const MessageList = ({ messages, currentUserId, activeRoomId, socket, activeRoom }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fait défiler vers le bas lorsque le tableau des messages change
  // ou lorsque le activeRoomId change (pour s'assurer qu'on est en bas si on change de salon)
  useEffect(() => {
    scrollToBottom();
  }, [messages, activeRoomId]); // Ajout de activeRoomId ici

  // Si aucun salon n'est actif, afficher un message d'invite
  if (!activeRoomId) {
    return (
        <div className="message-list empty" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', textAlign: 'center', padding: '20px' }}>
            <p style={{fontSize: '1.1rem', color: 'var(--text-color-secondary)'}}>Sélectionnez un salon pour commencer à discuter.</p>
            <p style={{fontSize: '0.9rem', color: 'var(--text-color-tertiary)'}}>Ou explorez de nouveaux salons pour rejoindre des conversations.</p>
        </div>
    );
  }

  // Si le salon est actif mais qu'il n'y a pas de messages
  if (!messages || messages.length === 0) {
    return (
        <div className="message-list empty" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', textAlign: 'center', padding: '20px' }}>
            <p style={{fontSize: '1.1rem', color: 'var(--text-color-secondary)'}}>Aucun message dans ce salon.</p>
            <p style={{fontSize: '0.9rem', color: 'var(--text-color-tertiary)'}}>Soyez le premier à envoyer un message !</p>
        </div>
    );
  }

  // Déterminer si le salon actif est un DM.
  // 'activeRoom' doit contenir une propriété comme 'isDirect' ou 'room_type'
  const isDirectMessageRoom = activeRoom?.isDirect || activeRoom?.room_type === 'direct';

  // Afficher la liste des messages
  return (
    <div className="message-list">
      {messages.map(msg => (
        <MessageItem
          key={msg.id}
          message={msg}
          sender={{ 
            id: msg.sender_id,
            name: msg.sender_username,
            avatarUrl: msg.sender_avatar_url
          }}
          isOwnMessage={msg.sender_id === currentUserId}
          socket={socket} 
          isDirectMessageRoom={isDirectMessageRoom} 
          // currentUserId est déjà utilisé pour isOwnMessage, MessageItem peut le déduire
        />
      ))}
      <div ref={messagesEndRef} /> {/* Élément vide pour le défilement */}
    </div>
  );
};

export default MessageList;