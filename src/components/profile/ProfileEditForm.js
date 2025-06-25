// src/components/profile/ProfileEditForm.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import InputField from '../common/InputField';
import SelectField from '../common/SelectField';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import LoadingSpinner from '../common/LoadingSpinner';
// Correction de l'importation ici :
import { FiUser, FiMail, FiCalendar, FiMapPin, FiSmile, FiSave, FiHeart, FiImage } from 'react-icons/fi';
import './ProfilePage.css';

const ProfileEditForm = () => {
  const { currentUser, updateUserProfile, loading: authLoadingState } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '', email: '', age: '', gender: '',
    interests: '', relationshipIntent: '', location: '', avatarUrl: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        age: currentUser.age || '',
        gender: currentUser.gender || '',
        interests: currentUser.interests || '', 
        relationshipIntent: currentUser.relationship_intent || '',
        location: currentUser.location || '',
        avatarUrl: currentUser.avatar_url || ''
      });
    }
  }, [currentUser]);

  if (authLoadingState && !currentUser) {
    return (
      <div className="profile-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id.replace('profile-', '')]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    try {
      const updatedData = {
        username: formData.username,
        email: formData.email,
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender,
        interests: formData.interests.split(',').map(i => i.trim()).filter(i => i), 
        relationshipIntent: formData.relationshipIntent,
        location: formData.location,
        avatarUrl: formData.avatarUrl,
      };
      await updateUserProfile(updatedData);
      setSuccess("Profil mis à jour avec succès !");
      setTimeout(() => {
        setSuccess('');
        navigate('/profile');
      }, 2000);
    } catch (err) {
      setError(err.message || "Erreur lors de la mise à jour du profil.");
      console.error("Erreur de soumission du profil:", err)
    }
    setIsSubmitting(false);
  };

   const genderOptions = [
    { value: '', label: 'Sélectionnez...' }, { value: 'male', label: 'Homme' },
    { value: 'female', label: 'Femme' }, { value: 'other', label: 'Autre' },
    { value: 'prefer_not_to_say', label: 'Préfère ne pas dire' },
  ];
  const intentOptions = [
    { value: '', label: 'Sélectionnez...' }, { value: 'serious_relationship', label: 'Relation sérieuse' },
    { value: 'casual_dating', label: 'Rencontres occasionnelles' }, { value: 'friendship', label: 'Amitié' },
    { value: 'networking', label: 'Réseautage' }, { value: 'not_sure', label: 'Pas sûr(e) encore' },
  ];

  return (
    <form onSubmit={handleSubmit} className="profile-edit-form profile-card">
      <div className="profile-header" style={{ alignItems: 'center', marginBottom: '30px' }}>
        <Avatar src={formData.avatarUrl || `https://i.pravatar.cc/150?u=${currentUser.id}`} alt={formData.username} size={100} />
        {/* L'icône FiImage est utilisée ici */}
        <InputField id="profile-avatarUrl" label="URL de l'avatar" value={formData.avatarUrl} onChange={handleChange} icon={<FiImage />} placeholder="https://exemple.com/image.png" />
      </div>

      {error && <p className="form-error-message">{error}</p>}
      {success && <p className="form-success-message">{success}</p>}

      <InputField id="profile-username" label="Nom d'utilisateur" value={formData.username} onChange={handleChange} icon={<FiUser />} required />
      <InputField id="profile-email" label="Email (non modifiable)" value={formData.email} icon={<FiMail />} disabled readOnly />
      <InputField id="profile-age" label="Âge" type="number" value={formData.age} onChange={handleChange} icon={<FiCalendar />} />
      <SelectField id="profile-gender" label="Sexe" value={formData.gender} onChange={handleChange} options={genderOptions} />
      <InputField id="profile-interests" label="Centres d'intérêt (séparés par virgules)" value={formData.interests} onChange={handleChange} icon={<FiSmile />} placeholder="Ex: lecture, voyage" />
      <SelectField id="profile-relationshipIntent" label="Intention de relation" value={formData.relationshipIntent} onChange={handleChange} options={intentOptions} icon={<FiHeart />} />
      <InputField id="profile-location" label="Localisation" value={formData.location} onChange={handleChange} icon={<FiMapPin />} placeholder="Ex: Paris, France"/>

      <div style={{ marginTop: '30px' }}>
        <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting} disabled={isSubmitting}>
          <FiSave /> Enregistrer les modifications
        </Button>
      </div>
    </form>
  );
};
export default ProfileEditForm;