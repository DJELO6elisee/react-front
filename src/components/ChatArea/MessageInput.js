// src/components/ChatArea/MessageInput.js
import React, { useState } from 'react';
import { FiSend, FiPaperclip, FiSmile } from 'react-icons/fi';
import './MessageInput.css';

const MessageInput = ({ onSendMessage }) => {
  const [messageText, setMessageText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };

  return (
    <form className="message-input-form" onSubmit={handleSubmit}>
      <button type="button" className="input-action-btn" title="Joindre un fichier">
        <FiPaperclip size={20} />
      </button>
      <input
        type="text"
        className="message-input-field"
        placeholder="Écrivez votre message..."
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
      />
      <button type="button" className="input-action-btn" title="Emojis">
        <FiSmile size={20} />
      </button>
      <button type="submit" className="send-btn" title="Envoyer">
        <FiSend size={20} />
      </button>
    </form>
  );
};

export default MessageInput;