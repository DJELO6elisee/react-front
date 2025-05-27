// src/components/common/Avatar.js
import React from 'react';
import defaultAvatar from '../../assets/default-avatar.png'; // Assurez-vous que ce chemin est correct

const Avatar = ({ src, alt, size = 40, online }) => {
  const handleError = (e) => {
    e.target.src = defaultAvatar; // Fallback si l'URL de l'avatar est cassée
  };

  const avatarStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    objectFit: 'cover',
    border: online ? '2px solid #4ade80' : 'none', // Indicateur online
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  };

  return (
    <img
      src={src || defaultAvatar}
      alt={alt || 'User Avatar'}
      style={avatarStyle}
      onError={handleError}
    />
  );
};

export default Avatar;