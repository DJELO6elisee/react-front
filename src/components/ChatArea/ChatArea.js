// src/components/ChatArea/ChatArea.js
import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import LoadingSpinner from '../common/LoadingSpinner';
import './ChatArea.css';

const ChatArea = ({ 
  activeRoom, 
  messages, 
  currentUserId, 
  onSendMessage, 
  loadingMessages,
  socket,
  typingUsernames,
  // Props pour la navigation mobile
  isMobile,
  onShowSidebarList, // Renommé pour plus de clarté
  onShowDetails      // Renommé pour plus de clarté
}) => {
  return (
    <main className="chat-area">
      <ChatHeader 
        activeRoom={activeRoom} 
        typingUsernames={typingUsernames}
        isMobile={isMobile}
        onShowSidebarList={onShowSidebarList} // Passé à ChatHeader
        onShowDetails={onShowDetails}         // Passé à ChatHeader
      />
      
      {loadingMessages && activeRoom && (!messages || messages.length === 0) ? (
        <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <MessageList messages={messages} currentUserId={currentUserId} activeRoomId={activeRoom?.id} />
      )}

      {activeRoom && (
        <MessageInput 
          onSendMessage={onSendMessage} 
          activeRoomId={activeRoom.id}
          socket={socket}
        />
      )}
    </main>
  );
};

export default ChatArea;