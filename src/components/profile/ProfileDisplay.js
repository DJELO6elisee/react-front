// src/components/profile/ProfileDisplay.js
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link, Navigate } from 'react-router-dom';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { FiEdit, FiMail, FiCalendar, FiUsers, FiHeart, FiMapPin, FiSmile } from 'react-icons/fi';
import './ProfilePage.css'; // CSS Partagé pour affichage et édition

const ProfileDisplay = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />; // Redirige si pas connecté
  }

  const getDisplayValue = (value, placeholder = 'Non spécifié') => value || placeholder;


  return (
    <div className="profile-card">
      <div className="profile-header">
        <Avatar src={currentUser.avatarUrl} alt={currentUser.name} size={100} />
        <h2>{currentUser.name}</h2>
        <p className="profile-email"><FiMail /> {currentUser.email}</p>
        <Link to="/profile/edit">
          <Button variant="outline" size="sm" iconLeft={<FiEdit />}>Modifier le profil</Button>
        </Link>
      </div>
      <div className="profile-details">
        <div className="profile-detail-item">
          <FiCalendar className="detail-icon" />
          <div>
            <strong>Âge:</strong> {getDisplayValue(currentUser.age)}
          </div>
        </div>
        <div className="profile-detail-item">
          <FiUsers className="detail-icon" /> {/* FiUsers pour le genre */}
          <div>
            <strong>Sexe:</strong> {getDisplayValue(currentUser.gender)}
          </div>
        </div>
        <div className="profile-detail-item">
          <FiSmile className="detail-icon" />
          <div>
            <strong>Centres d'intérêt:</strong> {getDisplayValue(currentUser.interests?.join(', '))}
          </div>
        </div>
        <div className="profile-detail-item">
          <FiHeart className="detail-icon" />
          <div>
            <strong>Intention de relation:</strong> {getDisplayValue(currentUser.relationshipIntent)}
          </div>
        </div>
        <div className="profile-detail-item">
          <FiMapPin className="detail-icon" />
          <div>
            <strong>Localisation:</strong> {getDisplayValue(currentUser.location)}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileDisplay;