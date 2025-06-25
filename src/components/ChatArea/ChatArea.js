// src/components/ChatArea/ChatArea.js
import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import LoadingSpinner from '../common/LoadingSpinner';
import './ChatArea.css';

const ChatArea = ({ 
  activeRoom,         // Objet complet du salon actif
  messages, 
  currentUserId, 
  onSendMessage, 
  loadingMessages,
  socket,             // Instance Socket.IO
  typingUsernames,    // Pour ChatHeader
  onLeaveRoom,    // Pour ChatHeader
  // Props pour la navigation mobile passées à ChatHeader
  isMobile,
  onShowSidebarList,
  onShowDetails      
}) => {
  return (
    <main className="chat-area">
      <ChatHeader 
        activeRoom={activeRoom} 
        typingUsernames={typingUsernames}
        isMobile={isMobile}
        onShowSidebarList={onShowSidebarList}
        onShowDetails={onShowDetails}
        onLeaveRoom={onLeaveRoom}
      />
      
      {loadingMessages && activeRoom && (!messages || messages.length === 0) ? (
        <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <MessageList 
            messages={messages} 
            currentUserId={currentUserId} 
            activeRoomId={activeRoom?.id}
            socket={socket}         // <<< PASSER socket à MessageList
            activeRoom={activeRoom}   // <<< PASSER activeRoom à MessageList (pour isDirectMessageRoom)
        />
      )}

      {activeRoom && (
        <MessageInput 
          onSendMessage={onSendMessage} 
          activeRoomId={activeRoom.id}
          socket={socket} // socket est déjà passé ici, c'est bien
          // Passer l'info si c'est un DM pour que MessageInput puisse marquer les notes vocales comme éphémères
          isDirectMessageRoom={activeRoom?.isDirect || activeRoom?.room_type === 'direct'} 
        />
      )}
    </main>
  );
};

export default ChatArea;