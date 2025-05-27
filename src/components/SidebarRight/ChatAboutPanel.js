// src/components/SidebarRight/ChatAboutPanel.js
import React from 'react';
import Avatar from '../common/Avatar';
import { usersData } from '../../data/mockData';
import { FiBell, FiPlusCircle } from 'react-icons/fi';
import './ChatAboutPanel.css';

const ChatAboutPanel = ({ room }) => {
  if (!room) return null;

  const participantsToDisplay = room.participants?.slice(0, 4) || [];
  const remainingParticipants = room.participants ? Math.max(0, room.participants.length - 4) : 0;

  return (
    <div className="chat-about-panel">
      <h3 className="about-title">{room.name}</h3>
      {room.description && <p className="room-description">{room.description}</p>}

      <div className="participants-section">
        <div className="participants-avatars">
          {participantsToDisplay.map(userId => {
            const user = usersData[userId];
            return user ? <Avatar key={userId} src={user.avatarUrl} alt={user.name} size={32} /> : null;
          })}
          {remainingParticipants > 0 && (
            <div className="avatar-more" title={`${remainingParticipants} autres membres`}>
              +{remainingParticipants}
            </div>
          )}
          <button className="add-participant-btn" title="Ajouter des membres">
            <FiPlusCircle size={28} />
          </button>
        </div>
      </div>

      <div className="notification-settings">
        <FiBell size={16} />
        <span>Notifications pour toute l'activité</span>
        <label className="switch">
          <input type="checkbox" defaultChecked />
          <span className="slider round"></span>
        </label>
      </div>
    </div>
  );
};

export default ChatAboutPanel;