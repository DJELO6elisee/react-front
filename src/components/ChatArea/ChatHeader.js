// src/components/ChatArea/ChatHeader.js
import React from 'react';
import { FiArrowLeft, FiMoreVertical, FiUsers, FiInfo, FiEdit3 } from 'react-icons/fi';
import './ChatHeader.css';

const ChatHeader = ({ 
  activeRoom, 
  typingUsernames = [], 
  isMobile,
  onShowSidebarList, // Handler pour le bouton "Retour"
  onShowDetails      // Handler pour le bouton "Info"
}) => {
  
  const roomName = activeRoom 
    ? (activeRoom.isDirect ? (activeRoom.other_participant?.username || activeRoom.name) : activeRoom.name) 
    : 'Sélectionnez un salon';

  let displayMetaInfo = null; // Pour le nombre de membres ou le statut en ligne

  if (activeRoom) {
    if (activeRoom.isDirect || activeRoom.room_type === 'direct') {
      if (activeRoom.other_participant) {
        displayMetaInfo = activeRoom.other_participant.isOnline 
          ? "En ligne" 
          : (activeRoom.other_participant.last_seen ? `Vu ${new Date(activeRoom.other_participant.last_seen).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : "Hors ligne");
      }
    } else { // Salon de groupe
      const memberCount = activeRoom.member_count || (Array.isArray(activeRoom.participants) ? activeRoom.participants.length : 0);
      if (memberCount > 0) {
        displayMetaInfo = (
          <>
            <FiUsers size={14} style={{ marginRight: '4px' }} /> 
            {memberCount} membre{memberCount !== 1 ? 's' : ''}
          </>
        );
      }
    }
  }

  const getTypingMessage = () => {
    if (!typingUsernames || typingUsernames.length === 0) return null;
    if (typingUsernames.length === 1) return `${typingUsernames[0]} est en train d'écrire...`;
    if (typingUsernames.length === 2) return `${typingUsernames[0]} et ${typingUsernames[1]} sont en train d'écrire...`;
    return `${typingUsernames[0]}, ${typingUsernames[1]} et ${typingUsernames.length - 2} autre(s) sont en train d'écrire...`;
  };
  const typingMessage = getTypingMessage();

  // Déterminer si on doit afficher le bouton info (pour SidebarRight)
  // Il est visible sur tablette (où SidebarRight est cachée par CSS)
  // ET sur mobile si un salon est actif
  const showInfoButton = (window.innerWidth <= 1024 || isMobile) && activeRoom;


  return (
    <header className="chat-header">
      {isMobile && (
        <button className="back-btn mobile-only" title="Retour à la liste" onClick={onShowSidebarList}>
          <FiArrowLeft size={22} />
        </button>
      )}

      <div className="room-info">
        <h2 className="room-title" title={roomName}>{roomName}</h2>
        <div className="room-meta-info">
          {displayMetaInfo && (
            <span className="room-members-or-status">
              {displayMetaInfo}
            </span>
          )}
          {typingMessage && (
            <span className={`typing-indicator ${displayMetaInfo ? 'with-meta' : ''}`}>
              <FiEdit3 size={14} style={{ marginRight: '4px', animation: 'typing-pulse 1.5s infinite ease-in-out' }} /> 
              {typingMessage}
            </span>
          )}
        </div>
      </div>

      <div className="header-actions">
        {showInfoButton && (
          <button className="action-btn mobile-only" title="Informations du salon" onClick={onShowDetails}>
              <FiInfo size={20} />
          </button>
        )}
        {/* Le bouton "Plus d'options" est visible sur desktop ou si ce n'est pas un mobile strict */}
        {(!isMobile || window.innerWidth > 480) && activeRoom && ( 
            <button className="action-btn desktop-only-medium" title="Plus d'options"> {/* Classe pour le cacher sur petits mobiles si besoin */}
              <FiMoreVertical size={20} />
            </button>
        )}
      </div>
    </header>
  );
};

export default ChatHeader;