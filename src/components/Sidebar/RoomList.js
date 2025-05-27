// src/components/Sidebar/RoomList.js
import React from 'react';
import { FaHashtag, FaPaintBrush, FaRocket, FaCoffee } from 'react-icons/fa'; // Exemples d'icônes
import './RoomList.css';

// Mapping des noms d'icônes aux composants d'icônes
const iconMap = {
  FaHashtag: FaHashtag,
  FaPaintBrush: FaPaintBrush,
  FaRocket: FaRocket,
  FaCoffee: FaCoffee,
};


const RoomList = ({ rooms, activeRoomId, onSelectRoom }) => {
  return (
    <div className="room-list-container">
      <h3 className="list-title">Salons de Discussion</h3>
      <ul className="room-list">
        {rooms.map(room => {
          const IconComponent = iconMap[room.icon] || FaHashtag; // Fallback icon
          return (
            <li
              key={room.id}
              className={`room-item ${room.id === activeRoomId ? 'active' : ''}`}
              onClick={() => onSelectRoom(room.id)}
            >
              <IconComponent className="room-icon" />
              <span className="room-name">{room.name}</span>
              {room.unread > 0 && <span className="unread-badge">{room.unread}</span>}
            </li>
          );
        })}
      </ul>
      <button className="new-room-btn">+ Nouveau Salon</button>
    </div>
  );
};

export default RoomList;