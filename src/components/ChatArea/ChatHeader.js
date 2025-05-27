// src/components/ChatArea/ChatHeader.js
import React from 'react';
import { FiArrowLeft, FiMoreVertical, FiUsers, FiInfo } from 'react-icons/fi';
import './ChatHeader.css';

const ChatHeader = ({ activeRoom }) => {
  const roomName = activeRoom ? activeRoom.name : 'Sélectionnez un salon';
  // Simuler un nombre de membres
  const memberCount = activeRoom ? Math.floor(Math.random() * 10) + 2 : 0;

  return (
    <header className="chat-header">
      <button className="back-btn mobile-only" title="Retour">
        <FiArrowLeft size={22} />
      </button>
      <div className="room-info">
        <h2 className="room-title">{roomName}</h2>
        {activeRoom && <span className="room-members"><FiUsers size={14}/> {memberCount} membres</span>}
      </div>
      <div className="header-actions">
        <button className="action-btn" title="Informations du salon">
            <FiInfo size={20} />
        </button>
        <button className="action-btn" title="Plus d'options">
          <FiMoreVertical size={20} />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;