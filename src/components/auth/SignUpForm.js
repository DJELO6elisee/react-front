// src/components/auth/SignUpForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import InputField from '../common/InputField';
import Button from '../common/Button';
import SelectField from '../common/SelectField';
// Assurez-vous que FiHeart est importé si vous l'utilisez pour relationshipIntent
import { FiUser, FiMail, FiLock, FiCalendar, FiMapPin, FiSmile, FiHeart } from 'react-icons/fi';
import './AuthForms.css'; // CSS partagé

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '', // Valeur initiale vide pour le SelectField
    interests: '',
    relationshipIntent: '', // Valeur initiale vide pour le SelectField
    location: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id.replace('signup-', '')]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setError('');
    setLoading(true);
    try {
      const signupData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender,
        interests: formData.interests.split(',').map(i => i.trim()).filter(i => i),
        relationshipIntent: formData.relationshipIntent,
        location: formData.location,
      };
      await auth.signup(signupData);
      navigate('/login');
    } catch (err) {
      setError(err.message || "Échec de l'inscription. Veuillez réessayer.");
    }
    setLoading(false);
  };

  const genderOptions = [
    { value: '', label: 'Sélectionnez votre sexe' }, // Placeholder
    { value: 'male', label: 'Homme' },
    { value: 'female', label: 'Femme' },
    { value: 'other', label: 'Autre' },
    { value: 'prefer_not_to_say', label: 'Préfère ne pas dire' },
  ];

  const intentOptions = [
    { value: '', label: 'Que recherchez-vous ?' }, // Placeholder
    { value: 'serious_relationship', label: 'Relation sérieuse' },
    { value: 'casual_dating', label: 'Rencontres occasionnelles' },
    { value: 'friendship', label: 'Amitié' },
    { value: 'networking', label: 'Réseautage' },
    { value: 'not_sure', label: 'Pas sûr(e) encore' },
  ];


  return (
    // Ajout de la classe signup-form-grid ici
    <form onSubmit={handleSubmit} className="auth-form signup-form-grid">
      {error && <p className="form-error-message full-width-grid-item">{error}</p>} {/* Erreur en pleine largeur */}

      {/* Tous ces champs seront placés dans la grille deux par deux sur grand écran */}
      <InputField id="signup-username" label="Nom d'utilisateur" value={formData.username} onChange={handleChange} icon={<FiUser />} required />
      <InputField id="signup-email" label="Email" type="email" value={formData.email} onChange={handleChange} icon={<FiMail />} required />
      <InputField id="signup-password" label="Mot de passe" type="password" value={formData.password} onChange={handleChange} icon={<FiLock />} required />
      <InputField id="signup-confirmPassword" label="Confirmer le mot de passe" type="password" value={formData.confirmPassword} onChange={handleChange} icon={<FiLock />} required />

      {/* Ce titre prendra toute la largeur grâce à sa classe */}
      <h3 className="form-section-title full-width-grid-item">Informations de profil (optionnel)</h3>

      {/* Ces champs suivront également la disposition en grille */}
      <InputField id="signup-age" label="Âge" type="number" value={formData.age} onChange={handleChange} icon={<FiCalendar />} />
      <SelectField id="signup-gender" label="Sexe" value={formData.gender} onChange={handleChange} options={genderOptions} /> {/* Placeholder est dans options */}
      <InputField id="signup-interests" label="Centres d'intérêt (virgules)" value={formData.interests} onChange={handleChange} icon={<FiSmile />} placeholder="Ex: lecture, voyage" />
      <SelectField id="signup-relationshipIntent" label="Intention de relation" value={formData.relationshipIntent} onChange={handleChange} options={intentOptions} icon={<FiHeart />} /> {/* Placeholder est dans options, icône ajoutée */}
      <InputField id="signup-location" label="Localisation (Ville, Pays)" value={formData.location} onChange={handleChange} icon={<FiMapPin />} placeholder="Ex: Paris, France" />
      {/* Input pour photo de profil : <InputField type="file" ... /> - gestion plus complexe */}

      {/* Ce conteneur de bouton prendra toute la largeur */}
      <div className="full-width-grid-item">
        <Button type="submit" variant="primary" fullWidth isLoading={loading} disabled={loading}>
          S'inscrire
        </Button>
      </div>
    </form>
  );
};
export default SignUpForm;