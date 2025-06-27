// src/pages/ResetPasswordPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthFormLayout from '../components/auth/AuthFormLayout';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import { FiLock } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'https://chatgather.p6-groupeb.com/api';

const ResetPasswordPage = () => {
  const { token } = useParams(); // Récupère le token de l'URL
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Token de réinitialisation manquant ou invalide.");
      // Optionnel : rediriger si pas de token
      // navigate('/login');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password/${token}`, { password, confirmPassword });
      setMessage(response.data.message || "Mot de passe réinitialisé avec succès !");
      setTimeout(() => navigate('/login'), 3000); // Rediriger vers login après succès
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Une erreur s'est produite.");
    }
    setLoading(false);
  };

  return (
    <AuthFormLayout
      title="Réinitialiser votre mot de passe"
      subtitle="Entrez votre nouveau mot de passe ci-dessous."
    >
      <form onSubmit={handleSubmit} className="auth-form">
        {message && <p className="form-success-message">{message}</p>}
        {error && <p className="form-error-message">{error}</p>}
        <InputField
          id="reset-password"
          label="Nouveau mot de passe"
          type="password"
          placeholder="Entrez votre nouveau mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<FiLock />}
          required
        />
        <InputField
          id="reset-confirm-password"
          label="Confirmer le nouveau mot de passe"
          type="password"
          placeholder="Confirmez votre nouveau mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon={<FiLock />}
          required
        />
        <Button type="submit" variant="primary" fullWidth isLoading={loading} disabled={loading || !token}>
          Réinitialiser le mot de passe
        </Button>
      </form>
    </AuthFormLayout>
  );
};
export default ResetPasswordPage;