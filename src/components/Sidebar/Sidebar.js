// src/components/Sidebar/Sidebar.js
import React from 'react';
import UserProfile from './UserProfile';
import RoomList from './RoomList';         // Pour les salons de Groupe
import ContactList from './ContactList';   // Pour les Messages Directs
import UserSearch from './UserSearch';     // Pour rechercher des utilisateurs
import LoadingSpinner from '../common/LoadingSpinner';
import './Sidebar.css';

const Sidebar = ({ 
  currentUser, 
  groupRooms,
  directMessageRooms,
  loadingLists,
  activeRoomId, 
  onSelectRoom,
  onOpenCreateRoomModal,
  onInitiateChat,
  isHidden // NOUVELLE PROP pour le cacher en mode mobile si ChatArea est visible
}) => {

  // Condition de chargement
  const showLoadingSpinner = loadingLists && 
                             (!groupRooms || groupRooms.length === 0) && 
                             (!directMessageRooms || directMessageRooms.length === 0);

  // Appliquer une classe pour cacher la sidebar si isHidden est true
  const sidebarClasses = `sidebar-left ${isHidden ? 'hidden-mobile' : ''}`;

  // Si isHidden est true, on ne rend rien ou un placeholder minimal pour éviter les sauts de layout
  // Mais avec le positionnement absolu et transform, il sera juste hors écran.
  // On peut le laisser rendre et laisser le CSS s'en occuper.

  return (
    <aside className={sidebarClasses}>
      <UserProfile user={currentUser} />
      
      <UserSearch onSelectUser={onInitiateChat} currentUser={currentUser} /> 
      
      <div className="sidebar-section-divider-horizontal"></div>

      {showLoadingSpinner ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', flexGrow: 1, alignItems: 'center', minHeight: '200px' }}>
          <LoadingSpinner size="md" />
        </div>
      ) : (
        <>
          <RoomList
            title="Salons de Groupe"
            rooms={groupRooms} 
            activeRoomId={activeRoomId}
            onSelectRoom={onSelectRoom}
            onOpenCreateRoomModal={onOpenCreateRoomModal}
          />
          
          <div className="sidebar-section-divider-horizontal"></div>
          
          <ContactList
            title="Amis/Contacts"
            conversations={directMessageRooms} 
            activeRoomId={activeRoomId}
            onSelectConversation={onSelectRoom} 
            currentUser={currentUser}
          />
        </>
      )}
    </aside>
  );
};

export default Sidebar;