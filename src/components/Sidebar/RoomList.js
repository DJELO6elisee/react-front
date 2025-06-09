// src/components/Sidebar/RoomList.js
import React from 'react';
// Importer Avatar si vous voulez une icône par défaut plus générique, sinon les icônes de FontAwesome
import { 
    FaHashtag, FaPaintBrush, FaRocket, FaCoffee, 
    FaComments, FaLock, FaPlusCircle 
} from 'react-icons/fa';
import './RoomList.css';

const iconMap = {
  FaHashtag, FaPaintBrush, FaRocket, FaCoffee, FaComments, FaLock,
  Default: FaHashtag 
};

const RoomList = ({ 
    title = "Salons de Groupe",
    rooms, 
    activeRoomId, 
    onSelectRoom, 
    onOpenCreateRoomModal,
}) => {

  if (!Array.isArray(rooms)) { // Garde pour s'assurer que rooms est un tableau
    console.warn("RoomList: 'rooms' prop n'est pas un tableau.", rooms);
    return (
        <div className="room-list-container">
            {title && <h3 className="list-title">{title}</h3>}
            <p className="empty-list-text">Chargement ou erreur...</p>
        </div>
    );
  }
  
  if (rooms.length === 0) {
    return (
      <div className="room-list-container">
        {title && <h3 className="list-title">{title}</h3>}
        <p className="empty-list-text">Aucun salon de groupe.</p>
        {onOpenCreateRoomModal && (
          <button className="new-room-btn" onClick={onOpenCreateRoomModal}>
            <FaPlusCircle style={{ marginRight: '8px' }} /> Nouveau Salon
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="room-list-container">
      {title && <h3 className="list-title">{title}</h3>}
      <ul className="room-list">
        {rooms.map(room => {
          // Ce composant ne s'attend qu'à des salons de groupe ici
          const IconComponent = iconMap[room.icon_name] || iconMap['Default'];
          return (
            <li
              key={room.id}
              className={`room-item group-room-item ${room.id === activeRoomId ? 'active' : ''}`}
              onClick={() => onSelectRoom(room.id)}
              title={`Ouvrir le salon ${room.name}`}
            >
              <IconComponent className="room-icon" />
              <span className="room-name">{room.name}</span>
              {room.unread_count > 0 && <span className="unread-badge">{room.unread_count}</span>}
            </li>
          );
        })}
      </ul>
      {onOpenCreateRoomModal && (
        <button className="new-room-btn" onClick={onOpenCreateRoomModal}>
          <FaPlusCircle style={{ marginRight: '8px' }} /> Nouveau Salon
        </button>
      )}
    </div>
  );
};

export default RoomList;