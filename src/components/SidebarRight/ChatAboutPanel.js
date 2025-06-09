// src/components/SidebarRight/ChatAboutPanel.js
import React from 'react';
import Avatar from '../common/Avatar';
// import { usersData } from '../../data/mockData'; // <<<--- SUPPRIMER CET IMPORT, PLUS NÉCESSAIRE
import { FiBell, FiPlusCircle, FiUsers } from 'react-icons/fi'; // Ajout de FiUsers pour le titre de la section
import './ChatAboutPanel.css';

const ChatAboutPanel = ({ room }) => {
  // Si room n'est pas encore chargé ou n'existe pas, ne rien afficher ou un placeholder.
  if (!room) {
    // Optionnel: afficher un petit loader ou un message si room est attendu mais pas encore là.
    // Pour l'instant, on retourne null comme avant.
    return null;
  }

  // Utiliser directement room.participants.
  // S'assurer que room.participants est bien un tableau.
  const participants = Array.isArray(room.participants) ? room.participants : [];
  
  const participantsToDisplayLimit = 4; // Nombre d'avatars à afficher directement
  const participantsToDisplay = participants.slice(0, participantsToDisplayLimit);
  const remainingParticipantsCount = Math.max(0, participants.length - participantsToDisplayLimit);

  const handleAddMembers = () => {
    // TODO: Logique pour ouvrir un modal ou une interface pour ajouter des membres
    console.log("Tentative d'ajout de membres au salon:", room.id);
    alert("Fonctionnalité d'ajout de membres à implémenter.");
  };

  const handleNotificationToggle = (event) => {
    // TODO: Logique pour mettre à jour les préférences de notification de l'utilisateur pour ce salon
    console.log("Notifications pour le salon", room.id, "sont maintenant:", event.target.checked ? "Activées" : "Désactivées");
    alert("Fonctionnalité de gestion des notifications à implémenter.");
  };


  return (
    <div className="chat-about-panel">
      {/* Informations de base du salon */}
      <h3 className="about-title">{room.name || 'Détails du salon'}</h3>
      {room.description && <p className="room-description">{room.description}</p>}
      {/* Vous pourriez ajouter d'autres infos comme la date de création, le créateur, etc. si disponibles */}
      {/* exemple: room.creator_username, formatDate(room.created_at) */}

      {/* Section des Participants */}
      <div className="sidebar-section-divider"></div> {/* Séparateur visuel */}
      
      <div className="participants-section">
        <h4 className="section-subtitle">
            <FiUsers style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Participants ({participants.length})
        </h4>
        {participants.length > 0 ? (
            <div className="participants-avatars">
            {participantsToDisplay.map(participant => (
                <Avatar 
                key={participant.id} 
                src={participant.avatar_url} // Utilise directement avatar_url du participant
                alt={participant.username}    // Utilise directement username du participant
                size={32} 
                title={participant.username}  // Pour le survol
                />
            ))}
            {remainingParticipantsCount > 0 && (
                <div className="avatar-more" title={`${remainingParticipantsCount} autres membres`}>
                +{remainingParticipantsCount}
                </div>
            )}
            {/* Le bouton ajouter des membres, maintenant avec un handler */}
            <button 
                className="add-participant-btn" 
                title="Ajouter des membres"
                onClick={handleAddMembers}
            >
                <FiPlusCircle size={28} />
            </button>
            </div>
        ) : (
            <p className="empty-section-text">Aucun participant (cela ne devrait pas arriver si vous êtes dedans).</p>
        )}
      </div>

      {/* Section des Notifications (Placeholder pour la fonctionnalité) */}
      <div className="sidebar-section-divider"></div>
      
      <div className="notification-settings">
        <FiBell size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
        <span>Notifications</span>
        <label className="switch">
          {/* TODO: L'état de cette checkbox devrait être géré (useState) et lié aux préférences utilisateur */}
          <input type="checkbox" defaultChecked onChange={handleNotificationToggle} />
          <span className="slider round"></span>
        </label>
      </div>

      {/* Vous pouvez ajouter d'autres sections ici, par ex. "Quitter le salon" */}

    </div>
  );
};

export default ChatAboutPanel;