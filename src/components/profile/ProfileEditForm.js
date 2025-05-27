// src/components/profile/ProfileEditForm.js
import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../hooks/useAuth'; // SUPPRIMÉ
import { useNavigate } from 'react-router-dom';
import InputField from '../common/InputField';
import SelectField from '../common/SelectField';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import { FiUser, FiMail, FiCalendar, FiMapPin, FiSmile, FiSave, FiHeart } from 'react-icons/fi';
import './ProfilePage.css';

// Données factices initiales pour le formulaire si besoin
const initialFormData = {
  username: 'Alex L\'Explorateur', email: 'alex.explorateur@example.com', age: '28', gender: 'other',
  interests: 'Randonnée, Photographie', relationshipIntent: 'friendship', location: 'Quelque part',
  avatarUrl: 'https://i.pravatar.cc/150?u=alexstatic'
};

const ProfileEditForm = () => {
  // const { currentUser, updateUserProfile, loading: authLoading } = useAuth(); // SUPPRIMÉ
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData); // Utilise les données initiales
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // useEffect pour remplir depuis currentUser n'est plus nécessaire
  // si on part de initialFormData

  const handleChange = (e) => { /* ... */ };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setFormLoading(true);
    console.log("Soumission du formulaire d'édition de profil (mode statique):", formData);
    setTimeout(() => {
      setSuccess("Modifications simulées enregistrées ! (Aucune donnée n'est réellement sauvegardée).");
      setFormLoading(false);
      // navigate('/profile'); // Optionnel: rediriger vers l'affichage du profil statique
    }, 1000);
  };

  const genderOptions = [ /* ... */ ];
  const intentOptions = [ /* ... */ ];
  // ... (définir les options comme avant)

  return (
    <form onSubmit={handleSubmit} className="profile-edit-form profile-card">
      <div className="profile-header" style={{ alignItems: 'center', marginBottom: '30px' }}>
        <Avatar src={formData.avatarUrl} alt={formData.username} size={100} />
        <p style={{fontSize: '0.8rem', color: 'var(--text-color-secondary)'}}>Upload d'image désactivé.</p>
      </div>

      {error && <p className="form-error-message">{error}</p>}
      {success && <p className="form-success-message">{success}</p>}

      <InputField id="profile-username" label="Nom d'utilisateur" value={formData.username} onChange={handleChange} icon={<FiUser />} />
      <InputField id="profile-email" label="Email" value={formData.email} onChange={handleChange} icon={<FiMail />} />
      {/* ... autres champs de formulaire ... */}
      <InputField id="profile-age" label="Âge" type="number" value={formData.age} onChange={handleChange} icon={<FiCalendar />} />
      <SelectField id="profile-gender" label="Sexe" value={formData.gender} onChange={handleChange} options={genderOptions} />
      <InputField id="profile-interests" label="Centres d'intérêt (virgules)" value={formData.interests} onChange={handleChange} icon={<FiSmile />} />
      <SelectField id="profile-relationshipIntent" label="Intention de relation" value={formData.relationshipIntent} onChange={handleChange} options={intentOptions} icon={<FiHeart />} />
      <InputField id="profile-location" label="Localisation" value={formData.location} onChange={handleChange} icon={<FiMapPin />} />

      <div style={{ marginTop: '30px' }}>
        <Button type="submit" variant="primary" fullWidth isLoading={formLoading} disabled={formLoading} iconLeft={<FiSave />}>
          Enregistrer (Simulation)
        </Button>
      </div>
    </form>
  );
};
export default ProfileEditForm;