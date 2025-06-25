// src/components/ChatArea/ChatHeader.js
import React, { useState } from 'react'; // Importer useState pour gérer le menu déroulant (optionnel)
import { FiArrowLeft, FiMoreVertical, FiUsers, FiInfo, FiEdit3, FiLogOut } from 'react-icons/fi'; // Ajout de FiLogOut
import './ChatHeader.css';

const ChatHeader = ({ 
  activeRoom, 
  typingUsernames = [], 
  isMobile,
  onShowSidebarList,
  onShowDetails,
  onLeaveRoom // << NOUVELLE PROP pour quitter le salon
}) => {
  
  // État pour un menu déroulant (si vous voulez mettre "Quitter" dans un menu)
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const roomName = activeRoom 
    ? (activeRoom.isDirect || activeRoom.room_type === 'direct' // Vérifier les deux pour robustesse
        ? (activeRoom.other_participant?.username || activeRoom.name || "Conversation") 
        : activeRoom.name) 
    : 'Sélectionnez un salon';

  let displayMetaInfo = null;

  if (activeRoom) {
    if (activeRoom.isDirect || activeRoom.room_type === 'direct') {
      if (activeRoom.other_participant) {
        displayMetaInfo = activeRoom.other_participant.isOnline 
          ? (<span className="status-online">En ligne</span>)
          : (activeRoom.other_participant.last_seen 
              ? `Vu ${new Date(activeRoom.other_participant.last_seen).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` 
              : "Hors ligne");
      }
    } else { // Salon de groupe
      // Utiliser activeRoom.participants.length si member_count n'est pas directement sur l'objet activeRoom
      // Ou s'assurer que member_count est bien mis à jour par les événements socket
      const memberCount = activeRoom.member_count ?? (Array.isArray(activeRoom.participants) ? activeRoom.participants.length : 0);
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

  const isGroupRoom = activeRoom && !(activeRoom.isDirect || activeRoom.room_type === 'direct');

  // Le bouton info est pour basculer la SidebarRight sur mobile/tablette
  const showInfoButton = isMobile && activeRoom; 
  // Sur desktop, la SidebarRight est contrôlée par une autre logique (isDesktopSidebarRightVisible dans ChatPage)
  // et le bouton info pourrait avoir un autre rôle ou être caché.

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
            <span className={`room-members-or-status ${activeRoom?.other_participant?.isOnline ? 'online' : ''}`}>
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
        {/* Bouton Info (pour afficher SidebarRight sur mobile/tablette) */}
        {showInfoButton && (
          <button className="action-btn" title="Informations du salon" onClick={onShowDetails}>
              <FiInfo size={20} />
          </button>
        )}

        {/* Bouton Quitter le groupe (uniquement pour les groupes) */}
        {isGroupRoom && onLeaveRoom && (
          <button 
            className="action-btn leave-room-btn"
            title="Quitter le groupe"
            onClick={() => {
                if (activeRoom) { // Double vérification
                    onLeaveRoom(activeRoom.id, activeRoom.name);
                }
            }}
          >
            <FiLogOut size={20} />
          </button>
        )}
        
        {/* Bouton "Plus d'options" - pourrait devenir un menu déroulant */}
        {/* Pour l'instant, il ne fait rien ou pourrait être masqué sur les très petits écrans si pas de place */}
        {activeRoom && ( // Afficher seulement si un salon est actif
            <div className="options-menu-container"> {/* Conteneur pour le positionnement du menu */}
                <button 
                    className="action-btn" 
                    title="Plus d'options"
                    onClick={() => setShowOptionsMenu(prev => !prev)} // Bascule l'affichage du menu
                >
                    <FiMoreVertical size={20} />
                </button>
                {showOptionsMenu && (
                    <div className="options-dropdown">
                        {/* Exemple d'option de menu, vous pouvez en ajouter d'autres */}
                        <button onClick={() => { alert('Paramètres du salon cliqué'); setShowOptionsMenu(false); }}>
                            Paramètres du salon
                        </button>
                        {/* Si "Quitter le groupe" est dans ce menu au lieu d'être un bouton direct */}
                        {/* {isGroupRoom && onLeaveRoom && (
                            <button onClick={() => { onLeaveRoom(activeRoom.id, activeRoom.name); setShowOptionsMenu(false); }}>
                                Quitter le groupe
                            </button>
                        )} */}
                    </div>
                )}
            </div>
        )}
      </div>
    </header>
  );
};

export default ChatHeader;