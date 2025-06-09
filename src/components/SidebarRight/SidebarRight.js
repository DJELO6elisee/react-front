// src/components/SidebarRight/SidebarRight.js
import React from 'react';
import ChatAboutPanel from './ChatAboutPanel';
import MediaGrid from './MediaGrid';
import SharedFilesList from './SharedFilesList';
import LoadingSpinner from '../common/LoadingSpinner';
import './SidebarRight.css';

const SidebarRight = ({ activeRoom, loadingRoomDetails }) => {
  // Log pour inspecter la prop activeRoom et ses sous-propriétés media/attachments
  console.log('FRONTEND (SidebarRight) - Props reçues: activeRoom:', 
              activeRoom ? JSON.stringify({ 
                                id: activeRoom.id, 
                                name: activeRoom.name, 
                                mediaCount: activeRoom.media?.length, 
                                attachmentsCount: activeRoom.attachments?.length,
                                // Logguez les premières entrées pour voir leur structure
                                firstMediaItem: activeRoom.media && activeRoom.media.length > 0 ? activeRoom.media[0] : null,
                                firstAttachment: activeRoom.attachments && activeRoom.attachments.length > 0 ? activeRoom.attachments[0] : null
                              }) : null, 
              'loadingRoomDetails:', loadingRoomDetails);

  if (loadingRoomDetails) {
    return (
      <aside className="sidebar-right placeholder">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <LoadingSpinner />
        </div>
      </aside>
    );
  }

  if (!activeRoom) {
    return (
      <aside className="sidebar-right placeholder">
        <span style={{color: 'var(--text-color-secondary)', fontStyle: 'italic'}}>
            Sélectionnez un salon pour voir ses détails.
        </span>
      </aside>
    );
  }


  return (
    <aside className="sidebar-right">
      <ChatAboutPanel room={activeRoom} />
      {/* Assurez-vous que activeRoom.media et activeRoom.attachments sont les bonnes props venant du backend */}
      <MediaGrid mediaItems={activeRoom.media || []} />
      <SharedFilesList files={activeRoom.attachments || []} sectionTitle="Pièces Jointes & Liens" />
    </aside>
  );
};

export default SidebarRight;