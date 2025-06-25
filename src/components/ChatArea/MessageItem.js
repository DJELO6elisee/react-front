// src/components/ChatArea/MessageItem.js
import React, { useRef } from 'react';
import Avatar from '../common/Avatar';
import Linkify from 'linkify-react'; 
import './MessageItem.css';
import { format, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';
// Ré-inclusion des icônes au cas où vous voudriez les utiliser pour des indicateurs.
// FiImage est utilisé pour l'icône img par défaut du navigateur si l'image ne charge pas.
import { FiFileText, FiDownload, FiLink, FiMic, FiVolume2 } from 'react-icons/fi';

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

const MessageItem = ({ 
    message, 
    sender, 
    isOwnMessage, 
    socket,        
    isDirectMessageRoom 
}) => {
  if (!sender) {
    sender = { id: 'unknown', name: 'Utilisateur inconnu', avatarUrl: '' };
  }

  const audioPlayerRef = useRef(null);

  const handleAudioEnded = () => {
    console.log(`MessageItem (handleAudioEnded): Déclencheur pour message ID: ${message?.id}`);
    console.log(`MessageItem (handleAudioEnded): Détails - is_ephemeral: ${message?.is_ephemeral}, message_type: ${message?.message_type}, isDirectMessageRoom: ${isDirectMessageRoom}, isOwnMessage: ${isOwnMessage}, socketConnected: ${socket?.connected}`);

    // Conditions pour supprimer la note vocale après lecture :
    // 1. Le message doit exister et avoir les propriétés nécessaires
    // 2. Il doit être marqué comme éphémère (is_ephemeral: true ou 1)
    // 3. Son type doit être 'voice_note'
    // 4. Le salon doit être un Message Direct
    // 5. L'utilisateur actuel ne doit PAS être l'expéditeur (seul le destinataire peut supprimer en écoutant)
    // 6. Le socket doit être valide et connecté
    if (
        message &&                          // S'assurer que l'objet message existe
        message.id &&                       // S'assurer qu'il a un ID
        message.room_id &&                  // S'assurer qu'il a un room_id
        (message.is_ephemeral === true || message.is_ephemeral === 1) && // Gérer booléen ou entier de la BDD
        message.message_type === 'voice_note' &&
        isDirectMessageRoom === true &&     // Explicitement true
        !isOwnMessage &&                    // L'utilisateur actuel est le destinataire
        socket && socket.connected
    ) {
        console.log(`MessageItem (handleAudioEnded): Conditions REMPLIES pour message ID: ${message.id}. Émission de 'markVoiceNotePlayed'.`);
        socket.emit('markVoiceNotePlayed', { 
            messageId: message.id, 
            roomId: message.room_id // Utiliser room_id car c'est ce que le backend et les messages contiennent souvent
        });
    } else {
        console.log(`MessageItem (handleAudioEnded): Conditions NON remplies pour message ID: ${message?.id}. Aucune action de suppression.`);
    }
  };

  const getMediaContent = (msg) => {
    // console.log('MessageItem - getMediaContent - Entrée avec msg:', JSON.stringify(msg, null, 2));
    if (!msg.media_url) return null;

    const fileName = msg.file_name || msg.media_url.substring(msg.media_url.lastIndexOf('/') + 1);
    const decodedFileName = decodeURIComponent(fileName);
    const fileType = msg.file_type || ''; 
    const messageTypeFromMsg = msg.message_type || 'standard';
    
    // console.log(`MessageItem - getMediaContent - Détails: fileName='${decodedFileName}', fileType='${fileType}', messageType='${messageTypeFromMsg}', media_url='${msg.media_url}'`);

    if (fileType === 'link') {
      let linkText = decodedFileName || msg.media_url;
      if (linkText.length > 60) linkText = linkText.substring(0, 57) + "...";
      return (
        <a href={msg.media_url} target="_blank" rel="noopener noreferrer" className="message-media-link-standalone">
          <FiLink style={{marginRight: '5px', flexShrink: 0}} /> {linkText}
        </a>
      );
    }

    if (fileType.startsWith('image/')) {
      // console.log('MessageItem - getMediaContent: Rendu comme IMAGE');
      return (
        <img 
          src={msg.media_url} 
          alt={decodedFileName || "Média image"} 
          className="message-media-image" 
          onClick={() => window.open(msg.media_url, '_blank')} 
          title={`Voir : ${decodedFileName || 'Image'}`}
          // onError={(e) => { e.target.style.display='none'; /* Ou afficher un placeholder */}} // Optionnel
        />
      );
    }

    if (fileType.startsWith('video/')) {
      // console.log('MessageItem - getMediaContent: Rendu comme VIDEO pour fileType:', fileType);
      return (
        <div className="message-media-video-container">
          <video controls src={msg.media_url} className="message-media-video" preload="metadata">
            Votre navigateur ne supporte pas la lecture de vidéos. 
            <a href={msg.media_url} download={decodedFileName}>Télécharger la vidéo ({decodedFileName})</a>
          </video>
        </div>
      );
    }
    
    if (fileType.startsWith('audio/') || messageTypeFromMsg === 'voice_note') {
      // console.log('MessageItem - getMediaContent: Rendu comme AUDIO/VOICE_NOTE pour fileType:', fileType);
      return (
         <div className="message-media-audio-container">
            {messageTypeFromMsg === 'voice_note' && (
                <FiMic size={20} style={{ 
                    marginRight: '8px', 
                    color: isOwnMessage ? 'var(--text-color-light-on-dark-bg, #e0e0e0)' : 'var(--primary-color)'
                }}/>
            )}
            {/* Si ce n'est pas une note vocale mais un fichier audio, on pourrait utiliser FiVolume2 */}
            {messageTypeFromMsg !== 'voice_note' && fileType.startsWith('audio/') && (
                <FiVolume2 size={20} style={{
                    marginRight: '8px',
                    color: isOwnMessage ? 'var(--text-color-light-on-dark-bg, #e0e0e0)' : 'var(--primary-color)'
                }}/>
            )}
            <audio 
                ref={audioPlayerRef}
                controls 
                src={msg.media_url} 
                className="message-media-audio" 
                preload="metadata"
                onEnded={handleAudioEnded}
            >
                Votre navigateur ne supporte pas la lecture audio.
            </audio>
        </div>
      );
    }

    if (fileType === 'application/pdf') {
      // console.log('MessageItem - getMediaContent: Rendu comme PDF');
      return (
        <a href={msg.media_url} target="_blank" rel="noopener noreferrer" download={decodedFileName} className="message-media-file">
          <FiFileText style={{marginRight: '5px', flexShrink: 0}} /> <span>{decodedFileName}</span> <FiDownload style={{marginLeft: 'auto', flexShrink: 0}}/>
        </a>
      );
    }

    // Fallback pour d'autres types de fichiers uploadés
    if (msg.media_url) { 
        // console.log('MessageItem - getMediaContent: Rendu comme FICHIER GÉNÉRIQUE pour fileType:', fileType);
        let icon = <FiFileText style={{marginRight: '5px', flexShrink: 0}} />; // Icône par défaut
        if (fileType.includes('word')) { /* Icône Word si vous en avez une spécifique */ }
        else if (fileType.includes('spreadsheet') || fileType.includes('excel')) { /* Icône Excel */ }
        // Vous pouvez ajouter plus d'icônes ici si nécessaire.
        return (
          <a href={msg.media_url} target="_blank" rel="noopener noreferrer" download={decodedFileName} className="message-media-file">
            {icon} <span>{decodedFileName || "Fichier joint"}</span> <FiDownload style={{marginLeft: 'auto', flexShrink: 0}}/>
          </a>
        );
    }
    // console.log('MessageItem - getMediaContent: Aucun média à rendre pour media_url:', msg.media_url);
    return null;
  };

  const mediaElement = getMediaContent(message);

  const linkifyOptions = {
    attributes: {
        target: '_blank',
        rel: 'noopener noreferrer nofollow',
    },
    className: 'message-text-link',
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