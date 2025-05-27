// src/components/profile/ProfileDisplay.js
import React from 'react';
// import { useAuth } from '../../hooks/useAuth'; // SUPPRIMÉ
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { FiEdit, FiMail, FiCalendar, FiUsers, FiHeart, FiMapPin, FiSmile } from 'react-icons/fi';
import './ProfilePage.css';

const defaultUserProfileData = { /* ... (défini comme avant) ... */ };
defaultUserProfileData.name = "Profil Statique"; // Pour clarifier

const ProfileDisplay = () => {
  // const { currentUser, loading } = useAuth(); // SUPPRIMÉ
  // const loading = false; // Si vous aviez un état de chargement local

  // Toujours afficher les données factices
  const displayUser = defaultUserProfileData;

  const getDisplayValue = (value, placeholder = 'Non spécifié') => { /* ... */ };

  return (
    <div className="profile-card">
      <div className="profile-header">
        <Avatar src={displayUser.avatarUrl} alt={displayUser.name} size={100} />
        <h2>{displayUser.name}</h2>
        <p className="profile-email"><FiMail /> {displayUser.email}</p>
        {/* Afficher toujours le lien vers l'édition, car il n'y a plus de currentUser pour conditionner */}
        <Link to="/profile/edit">
          <Button variant="outline" size="sm" iconLeft={<FiEdit />}>Modifier ce profil (Statique)</Button>
        </Link>
      </div>
      <div className="profile-details">
        {/* ... (afficher les détails de displayUser) ... */}
        <div className="profile-detail-item">
          <FiCalendar className="detail-icon" />
          <div><strong>Âge:</strong> {getDisplayValue(displayUser.age)}</div>
        </div>
        <div className="profile-detail-item">
          <FiUsers className="detail-icon" />
          <div><strong>Sexe:</strong> {getDisplayValue(displayUser.gender)}</div>
        </div>
        <div className="profile-detail-item">
          <FiSmile className="detail-icon" />
          <div><strong>Centres d'intérêt:</strong> {getDisplayValue(displayUser.interests)}</div>
        </div>
        <div className="profile-detail-item">
          <FiHeart className="detail-icon" />
          <div><strong>Intention de relation:</strong> {getDisplayValue(displayUser.relationshipIntent)}</div>
        </div>
        <div className="profile-detail-item">
          <FiMapPin className="detail-icon" />
          <div><strong>Localisation:</strong> {getDisplayValue(displayUser.location)}</div>
        </div>
      </div>
    </div>
  );
};
export default ProfileDisplay;