// src/components/layout/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import { 
    FiMessageSquare, 
    FiUser, 
    FiLogIn, 
    FiUserPlus, 
    FiLogOut, 
    FiCompass, 
    FiHome
} from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      // Gérer l'erreur d'affichage à l'utilisateur si nécessaire
    }
  };

  return (
    <nav className="navbar">
      <Link to={currentUser ? "/chat" : "/"} className="navbar-brand">
        <FiHome /> <span className="brand-text">ChatGather</span> {/* Texte de la marque dans un span */}
      </Link>
      <div className="navbar-links">
        <Link to="/explore-rooms" className="nav-link" title="Explorer les Salons">
          <FiCompass /> <span className="nav-link-text">Explorer</span>
        </Link>
        {currentUser ? (
          <>
            <Link to="/chat" className="nav-link" title="Chat">
              <FiMessageSquare /> <span className="nav-link-text">Chat</span>
            </Link>
            <Link to="/profile" className="nav-link" title={`Profil de ${currentUser.username}`}>
              <FiUser /> <span className="nav-link-text">Profil ({currentUser.username})</span>
            </Link>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              size="sm" 
              aria-label="Déconnexion" // Pour l'accessibilité quand le texte est caché
              title="Déconnexion"
            >
              <FiLogOut /> <span className="button-nav-text">Déconnexion</span>
            </Button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link" title="Connexion">
              <FiLogIn /> <span className="nav-link-text">Connexion</span>
            </Link>
            <Link to="/signup" className="nav-link" title="Inscription">
              {/* Pour le bouton d'inscription, on peut le garder avec texte ou le rendre icon-only aussi */}
              {/* Option 1: Bouton standard */}
              {/* <Button variant="primary" size="sm" iconLeft={<FiUserPlus />}>Inscription</Button> */}
              {/* Option 2: Similaire aux autres liens pour cacher le texte */}
              <FiUserPlus /> <span className="nav-link-text">Inscription</span> 
              {/* Si Option 2, le style du bouton 'primary' doit être appliqué via .nav-link et une classe additionnelle au lieu du composant Button */}
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;