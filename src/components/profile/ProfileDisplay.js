// src/components/profile/ProfileDisplay.js
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { FiEdit, FiMail, FiCalendar, FiUsers, FiHeart, FiMapPin, FiSmile } from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner'; // Pour l'état de chargement
import './ProfilePage.css';

const ProfileDisplay = () => {
  const { currentUser, loading } = useAuth(); // loading vient maintenant d'AuthContext

  if (loading) {
    return (
      <div className="profile-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="profile-card" style={{ textAlign: 'center', padding: '40px' }}>
        <h2>Profil Utilisateur</h2>
        <p style={{ margin: '20px 0', color: 'var(--text-color-secondary)' }}>
          Impossible de charger les informations du profil.
        </p>
        <p>
          Veuillez essayer de vous <Link to="/login" className="auth-link">connecter</Link>.
        </p>
      </div>
    );
  }

  const getDisplayValue = (value, placeholder = 'Non spécifié') => {
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : placeholder;
    }
    // Pour le champ 'interests' qui est une chaîne séparée par des virgules en BDD
    if (typeof value === 'string' && value.includes(',')) {
        return value; // Ou value.split(',').join(', ') si vous voulez être sûr de l'espacement
    }
    return value || placeholder;
  };

  return (
    <div className="profile-card">
      <div className="profile-header">
        <Avatar src={currentUser.avatar_url || `https://i.pravatar.cc/150?u=${currentUser.id}`} alt={currentUser.username} size={100} online /> {/* Utiliser avatar_url */}
        <h2>{currentUser.username}</h2>
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
          <FiUsers className="detail-icon" />
          <div>
            <strong>Sexe:</strong> {getDisplayValue(currentUser.gender)}
          </div>
        </div>
        <div className="profile-detail-item">
          <FiSmile className="detail-icon" />
          <div>
            {/* 'interests' est une chaîne séparée par des virgules venant de la BDD */}
            <strong>Centres d'intérêt:</strong> {getDisplayValue(currentUser.interests)}
          </div>
        </div>
        <div className="profile-detail-item">
          <FiHeart className="detail-icon" />
          <div>
            <strong>Intention de relation:</strong> {getDisplayValue(currentUser.relationship_intent)} {/* Nom de colonne SQL */}
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