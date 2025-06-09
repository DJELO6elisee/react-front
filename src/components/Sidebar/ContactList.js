// src/components/Sidebar/ContactList.js
import React from 'react';
import Avatar from '../common/Avatar';
import { formatDistanceToNowStrict } from 'date-fns';
import { fr } from 'date-fns/locale';
import './ContactList.css'; // Assurez-vous que ces styles sont adaptés

const ContactList = ({ 
    title = "Messages Directs", 
    conversations, // Attend un tableau de conversations (vos directMessageRooms)
    activeRoomId,
    onSelectConversation, // Devrait appeler handleSelectRoom(convo.id) dans ChatPage
    currentUser 
}) => { 
  
  // Garde plus robuste au début du composant
  if (!Array.isArray(conversations)) {
    // Ce log est celui que vous voyez, il est normal si les données ne sont pas encore chargées
    // console.warn("ContactList: 'conversations' prop n'est pas un tableau au rendu initial ou pendant le chargement. Valeur:", conversations);
    return (
      <div className="contact-list-container dm-list-container">
        {title && <h3 className="list-title">{title}</h3>}
        {/* Optionnel: afficher un petit spinner ici si vous avez un état de chargement pour les DMs */}
        <p className="empty-list-text">Chargement des conversations...</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="contact-list-container dm-list-container">
        {title && <h3 className="list-title">{title}</h3>}
        <p className="empty-list-text">Aucune conversation directe pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="contact-list-container dm-list-container">
      {title && <h3 className="list-title">{title}</h3>}
      <ul className="contact-list dm-list">
        {conversations.map(convo => {
          // S'assurer que 'other_participant' est bien la structure attendue
          const partner = convo.other_participant;

          if (!partner || !partner.id) { 
            console.warn("ContactList: Conversation DM sans other_participant valide ou ID manquant:", convo);
            return null; // Ne pas rendre cet item s'il est malformé
          }

          let lastMessagePreview = "Démarrez la conversation !";
          let lastMessageTime = "";

          if (convo.last_message && convo.last_message.created_at) {
            const prefix = convo.last_message.sender_id === currentUser?.id ? "Vous: " : "";
            let text = convo.last_message.text || (convo.last_message.media_url ? "Fichier partagé" : "...");
            if (typeof text === 'string' && text.length > 25) text = text.substring(0, 22) + "...";
            lastMessagePreview = prefix + text;
            try {
                lastMessageTime = formatDistanceToNowStrict(new Date(convo.last_message.created_at), { addSuffix: true, locale: fr });
            } catch (e) { console.error("Erreur formatage date last_message:", e); lastMessageTime = "";}

          } else if (convo.updated_at) {
             try {
                lastMessageTime = formatDistanceToNowStrict(new Date(convo.updated_at), { addSuffix: true, locale: fr });
             } catch (e) { console.error("Erreur formatage date updated_at:", e); lastMessageTime = "";}
          }


          return (
            <li 
              key={convo.id} 
              className={`contact-item dm-item ${convo.id === activeRoomId ? 'active' : ''}`}
              onClick={() => onSelectConversation(convo.id)}
              title={`Discuter avec ${partner.username || 'Utilisateur'}`}
            >
              <Avatar 
                src={partner.avatar_url} 
                alt={partner.username || 'Avatar'} 
                size={38}
                online={partner.isOnline || false} // 'isOnline' doit venir des données du partenaire
                className="dm-avatar"
              />
              <div className="contact-info-dm">
                <div className="contact-name-time">
                    <span className="contact-name">{partner.username || 'Utilisateur'}</span>
                    {lastMessageTime && <span className="last-message-time">{lastMessageTime}</span>}
                </div>
                <span className="last-message-preview">{lastMessagePreview}</span>
              </div>
              {/* S'assurer que unread_count est un nombre */}
              {typeof convo.unread_count === 'number' && convo.unread_count > 0 && (
                <span className="unread-badge dm-unread">{convo.unread_count}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ContactList;