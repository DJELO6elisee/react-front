// src/components/ChatArea/MessageItem.js
import React from 'react';
import Avatar from '../common/Avatar';
import Linkify from 'linkify-react'; // <<<--- IMPORTER LINKIFY
import './MessageItem.css';
import { format, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FiFileText, FiDownload, FiLink /*, FiImage, FiPlayCircle, FiVolume2 */ } from 'react-icons/fi';

// La fonction isURL a été supprimée car non utilisée directement ici si file_type gère les liens

const formatDateTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  if (isToday(date)) {
    return format(date, 'HH:mm', { locale: fr });
  }
  if (isYesterday(date)) {
    return `Hier ${format(date, 'HH:mm', { locale: fr })}`;
  }
  return format(date, 'dd MMM HH:mm', { locale: fr });
};

const MessageItem = ({ message, sender, isOwnMessage }) => {
  if (!sender) {
    sender = { id: 'unknown', name: 'Utilisateur inconnu', avatarUrl: '' };
  }

  const getMediaContent = (msg) => {
    if (!msg.media_url) return null;

    // Utiliser msg.file_name si fourni par le backend, sinon extraire de media_url
    const fileName = msg.file_name || msg.media_url.substring(msg.media_url.lastIndexOf('/') + 1);
    const decodedFileName = decodeURIComponent(fileName);
    const fileType = msg.file_type || ''; // Utiliser file_type s'il vient du backend

    // 1. Gérer les liens explicitement marqués avec file_type: 'link'
    if (fileType === 'link') {
      let linkText = decodedFileName; // Pour les liens, fileName est souvent le hostname ou l'URL tronquée
      // Si decodedFileName est l'URL complète et que vous voulez la tronquer:
      // if (linkText.startsWith('http') && linkText.length > 50) linkText = linkText.substring(0, 47) + "...";
      return (
        <a href={msg.media_url} target="_blank" rel="noopener noreferrer" className="message-media-link-standalone">
          <FiLink style={{marginRight: '5px'}} /> {linkText}
        </a>
      );
    }

    // 2. Gérer les fichiers uploadés (images, PDF, etc.)
    if (fileType.startsWith('image/') || /\.(jpeg|jpg|gif|png|webp|bmp)$/i.test(msg.media_url)) {
      return <img src={msg.media_url} alt={decodedFileName} className="message-media-image" onClick={() => window.open(msg.media_url, '_blank')} />;
    }
    if (fileType === 'application/pdf' || /\.(pdf)$/i.test(msg.media_url)) {
      return (
        <a href={msg.media_url} target="_blank" rel="noopener noreferrer" download={decodedFileName} className="message-media-file">
          <FiFileText /> <span>{decodedFileName}</span> <FiDownload />
        </a>
      );
    }
    // TODO: Ajouter ici la logique pour les vidéos et l'audio si nécessaire, basée sur fileType ou extension
    // if (fileType.startsWith('video/') || /\.(mp4|webm|mov)$/i.test(msg.media_url)) { ... }
    // if (fileType.startsWith('audio/') || /\.(mp3|wav)$/i.test(msg.media_url)) { ... }


    // 3. Fallback pour d'autres types de fichiers uploadés (non image/pdf/lien/vidéo/audio)
    // Cette condition s'applique si media_url est présent mais ne correspond à aucun des types ci-dessus.
    // On suppose que c'est un fichier téléchargeable.
    if (msg.media_url) { 
        return (
          <a href={msg.media_url} target="_blank" rel="noopener noreferrer" download={decodedFileName} className="message-media-file">
            <FiFileText /> <span>{decodedFileName || "Fichier joint"}</span> <FiDownload />
          </a>
        );
    }

    return null; // Si media_url est là mais aucun cas ne correspond (ne devrait pas arriver avec le fallback)
  };

  const mediaElement = getMediaContent(message);

  const linkifyOptions = {
    target: '_blank',
    rel: 'noopener noreferrer',
    className: 'message-text-link'
  };

  return (
    <div className={`message-item ${isOwnMessage ? 'own-message' : 'other-message'}`}>
      {!isOwnMessage && <Avatar src={sender.avatar_url || sender.avatarUrl} alt={sender.name || sender.sender_username} size={36} />}
      
      <div className="message-bubble">
        {!isOwnMessage && <div className="sender-name">{sender.name || sender.sender_username}</div>}
        
        {mediaElement && (
            <div className="message-media-container">{mediaElement}</div>
        )}

        {message.text && (
          <div className="message-text">
            <Linkify options={linkifyOptions}>
              {message.text}
            </Linkify>
          </div>
        )}
        
        <div className="message-timestamp">
          {formatDateTimestamp(message.created_at || message.timestamp)}
        </div>
      </div>

      {isOwnMessage && <Avatar src={sender.avatar_url || sender.avatarUrl} alt={sender.name || sender.sender_username} size={36} />}
    </div>
  );
};

export default MessageItem;