// src/components/Sidebar/UserProfile.js
import React from 'react';
import Avatar from '../common/Avatar';
import { FiSettings, FiChevronDown } from 'react-icons/fi';
import './UserProfile.css';

const UserProfile = ({ user }) => {
  if (!user) return null;

  return (
    <div className="user-profile">
      <Avatar src={user.avatarUrl} alt={user.name} size={48} online />
      <div className="user-info">
        <span className="user-name">{user.name} <FiChevronDown size={14} /></span>
        <span className="user-status">En ligne</span>
      </div>
      <button className="settings-btn" title="Paramètres">
        <FiSettings size={20} />
      </button>
    </div>
  );
};

export default UserProfile;