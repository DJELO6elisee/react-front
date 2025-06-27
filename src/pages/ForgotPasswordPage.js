// src/pages/ForgotPasswordPage.js
import React, { useState } from 'react';
import axios from 'axios';
import AuthFormLayout from '../components/auth/AuthFormLayout';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import { FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setMessage(response.data.message || "Instructions envoyées si l'e-mail est valide.");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Une erreur s'est produite.");
    }
    setLoading(false);
  };

  return (
    <AuthFormLayout
      title="Mot de passe oublié ?"
      subtitle="Entrez votre e-mail pour recevoir un lien de réinitialisation."
      footerText="Retour à la"
      footerLink={{ to: "/login", text: "Connexion" }}
    >
      <form onSubmit={handleSubmit} className="auth-form">
        {message && <p className="form-success-message">{message}</p>}
        {error && <p className="form-error-message">{error}</p>}
        <InputField
          id="forgot-email"
          label="Adresse e-mail"
          type="email"
          placeholder="Entrez votre e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<FiMail />}
          required
        />
        <Button type="submit" variant="primary" fullWidth isLoading={loading} disabled={loading}>
          Envoyer le lien de réinitialisation
        </Button>
        <div className="auth-form-extra-links" style={{marginTop: '15px', textAlign: 'center'}}>
          <Link to="/login" className="auth-link">Se souvenir du mot de passe ? Se connecter</Link>
        </div>
      </form>
    </AuthFormLayout>
  );
};
export default ForgotPasswordPage;