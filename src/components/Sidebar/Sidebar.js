// src/components/Sidebar/Sidebar.js
import React from 'react';
import UserProfile from './UserProfile';
import RoomList from './RoomList';
import ContactList from './ContactList';
import './Sidebar.css';

const Sidebar = ({ currentUser, rooms, contacts, activeRoomId, onSelectRoom }) => {
  return (
    <aside className="sidebar-left">
      <UserProfile user={currentUser} />
      <RoomList rooms={rooms} activeRoomId={activeRoomId} onSelectRoom={onSelectRoom} />
      <ContactList contacts={contacts} />
    </aside>
  );
};

export default Sidebar;