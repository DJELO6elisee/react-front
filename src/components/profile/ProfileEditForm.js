// src/components/profile/ProfileEditForm.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import InputField from '../common/InputField';
import SelectField from '../common/SelectField';
import Button from '../common/Button';
import Avatar from '../common/Avatar'; // Pour afficher l'avatar actuel
import { FiUser, FiMail, FiCalendar, FiMapPin, FiSmile, FiSave } from 'react-icons/fi';
import './ProfilePage.css'; // CSS Partagé

const ProfileEditForm = () => {
  const { currentUser, updateUserProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', email: '', age: '', gender: '',
    interests: '', relationshipIntent: '', location: '', avatarUrl: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  // const [profileImageFile, setProfileImageFile] = useState(null); // Pour l'upload d'image

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.name || '',
        email: currentUser.email || '', // L'email n'est généralement pas modifiable ici
        age: currentUser.age || '',
        gender: currentUser.gender || '',
        interests: currentUser.interests?.join(', ') || '',
        relationshipIntent: currentUser.relationshipIntent || '',
        location: currentUser.location || '',
        avatarUrl: currentUser.avatarUrl || '' // Pour l'affichage, pas pour l'input direct
      });
    }
  }, [currentUser]);

  if (!currentUser && !authLoading) { // Si pas d'utilisateur et que le chargement initial est terminé
    navigate('/login');
    return null;
  }
  if (authLoading || !currentUser) return <p>Chargement du profil...</p>; // Ou un spinner

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id.replace('profile-', '')]: e.target.value });
  };

  // const handleImageChange = (e) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setProfileImageFile(e.target.files[0]);
  //     // Optionnel: afficher un aperçu de l'image
  //     const reader = new FileReader();
  //     reader.onload = (event) => setFormData({...formData, avatarUrl: event.target.result });
  //     reader.readAsDataURL(e.target.files[0]);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFormLoading(true);
    try {
      // Préparer les données
      const updatedData = {
        name: formData.username, // 'name' est la clé attendue par AuthContext
        // email: formData.email, // Ne pas permettre la modification de l'email ici facilement
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender,
        interests: formData.interests.split(',').map(i => i.trim()).filter(i => i),
        relationshipIntent: formData.relationshipIntent,
        location: formData.location,
        // avatarUrl: formData.avatarUrl, // Si on permet de changer l'URL manuellement
      };
      // Si profileImageFile, il faudrait l'uploader vers un backend ici et obtenir l'URL
      // puis mettre à jour updatedData.avatarUrl = nouvelleUrl;

      await updateUserProfile(updatedData);
      setSuccess("Profil mis à jour avec succès !");
      setTimeout(() => navigate('/profile'), 1500); // Rediriger après succès
    } catch (err) {
      setError(err.message || "Erreur lors de la mise à jour du profil.");
    }
    setFormLoading(false);
  };

  const genderOptions = [ /* ... (copier depuis SignUpForm) ... */ ];
  const intentOptions = [ /* ... (copier depuis SignUpForm) ... */ ];
  genderOptions.unshift({ value: '', label: 'Sélectionnez...' }); // Option par défaut
  intentOptions.unshift({ value: '', label: 'Sélectionnez...' });

  return (
    <form onSubmit={handleSubmit} className="profile-edit-form profile-card"> {/* Réutilise profile-card */}
      <div className="profile-header" style={{ alignItems: 'center', marginBottom: '30px' }}>
        <Avatar src={formData.avatarUrl || currentUser.avatarUrl} alt={formData.username} size={100} />
        {/* <InputField id="profile-image" label="Changer la photo de profil" type="file" onChange={handleImageChange} icon={<FiImage />} accept="image/*" /> */}
        <p style={{fontSize: '0.8rem', color: 'var(--text-color-secondary)'}}>La gestion de l'upload d'image nécessite un backend.</p>
      </div>

      {error && <p className="form-error-message">{error}</p>}
      {success && <p className="form-success-message">{success}</p>}

      <InputField id="profile-username" label="Nom d'utilisateur" value={formData.username} onChange={handleChange} icon={<FiUser />} required />
      <InputField id="profile-email" label="Email (non modifiable)" value={formData.email} icon={<FiMail />} disabled readOnly />
      <InputField id="profile-age" label="Âge" type="number" value={formData.age} onChange={handleChange} icon={<FiCalendar />} />
      <SelectField id="profile-gender" label="Sexe" value={formData.gender} onChange={handleChange} options={genderOptions} />
      <InputField id="profile-interests" label="Centres d'intérêt (séparés par virgules)" value={formData.interests} onChange={handleChange} icon={<FiSmile />} />
      <SelectField id="profile-relationshipIntent" label="Intention de relation" value={formData.relationshipIntent} onChange={handleChange} options={intentOptions} />
      <InputField id="profile-location" label="Localisation" value={formData.location} onChange={handleChange} icon={<FiMapPin />} />

      <div style={{ marginTop: '30px' }}>
        <Button type="submit" variant="primary" fullWidth isLoading={formLoading || authLoading} disabled={formLoading || authLoading} iconLeft={<FiSave />}>
          Enregistrer les modifications
        </Button>
      </div>
    </form>
  );
};
export default ProfileEditForm;