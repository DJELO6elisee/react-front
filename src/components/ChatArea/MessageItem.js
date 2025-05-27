// src/components/ChatArea/MessageItem.js
import React from 'react';
import Avatar from '../common/Avatar';
import './MessageItem.css';
import { format, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale'; // Pour les dates en français

const formatDateTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  if (isToday(date)) {
    return format(date, 'HH:mm');
  }
  if (isYesterday(date)) {
    return `Hier ${format(date, 'HH:mm')}`;
  }
  return format(date, 'dd MMM HH:mm', { locale: fr });
};

const MessageItem = ({ message, sender, isOwnMessage }) => {
  if (!sender) { // Fallback si l'expéditeur n'est pas trouvé
    sender = { name: 'Utilisateur inconnu', avatarUrl: '' };
  }
  return (
    <div className={`message-item ${isOwnMessage ? 'own-message' : 'other-message'}`}>
      {!isOwnMessage && <Avatar src={sender.avatarUrl} alt={sender.name} size={36} />}
      <div className="message-bubble">
        {!isOwnMessage && <div className="sender-name">{sender.name}</div>}
        <div className="message-text">{message.text}</div>
        <div className="message-timestamp">
          {formatDateTimestamp(message.timestamp)}
        </div>
      </div>
      {isOwnMessage && <Avatar src={sender.avatarUrl} alt={sender.name} size={36} />}
    </div>
  );
};

export default MessageItem;