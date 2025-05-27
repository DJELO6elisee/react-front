// src/components/auth/LoginForm.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import InputField from '../common/InputField';
import Button from '../common/Button';
import { FiMail, FiLock } from 'react-icons/fi';
import './AuthForms.css'; // CSS partagé pour les formulaires

const LoginForm = () => {
  const [email, setEmail] = useState(''); // Ou username
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Pour la simulation, login prend username, adaptez si vous utilisez email
      await auth.login(email, password); // Supposons que 'email' ici soit utilisé comme 'username'
      navigate('/chat'); // Ou '/profile' ou la page principale après connexion
    } catch (err) {
      setError(err.message || 'Échec de la connexion. Veuillez réessayer.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {error && <p className="form-error-message">{error}</p>}
      <InputField
        id="login-email"
        label="Nom d'utilisateur ou Email"
        type="text" // Ou "email" si vous changez la logique de login
        placeholder="Entrez votre nom d'utilisateur"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<FiMail />}
        required
      />
      <InputField
        id="login-password"
        label="Mot de passe"
        type="password"
        placeholder="Entrez votre mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={<FiLock />}
        required
      />
      <div className="form-options">
        {/* <label className="checkbox-remember"> <input type="checkbox" /> Se souvenir de moi </label> */}
        <Link to="/forgot-password"className="auth-link small-link">Mot de passe oublié ?</Link>
      </div>
      <Button type="submit" variant="primary" fullWidth isLoading={loading} disabled={loading}>
        Se connecter
      </Button>
    </form>
  );
};
export default LoginForm;