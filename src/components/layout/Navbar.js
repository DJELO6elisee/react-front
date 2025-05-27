// src/components/layout/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom'; // useNavigate n'est plus nécessaire ici
// import { useAuth } from '../../hooks/useAuth'; // SUPPRIMÉ car currentUser est toujours null et logout est factice
import Button from '../common/Button';
// FiMessageSquare, FiUser, FiLogOut ne sont plus utilisés si currentUser est toujours null
import { FiLogIn, FiUserPlus, FiMic, FiMessageSquare } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  // const { currentUser, logout } = useAuth(); // currentUser sera toujours null dans ce mode
  // const navigate = useNavigate(); // Plus besoin si handleLogout est simplifié

  // handleLogout n'est plus nécessaire car il n'y a pas d'utilisateur à déconnecter
  // const handleLogout = () => {
  //   // logout(); // La fonction logout du contexte est maintenant factice
  //   // navigate('/login');
  //   console.log("Tentative de déconnexion (mode statique)");
  // };

  return (
    <nav className="navbar">
      {/* Le lien de la marque peut toujours pointer vers la page de chat par défaut ou la page de connexion */}
      <Link to={"/"} className="navbar-brand"> {/* Ou "/login" si c'est la page d'accueil par défaut */}
        <FiMic /> VoiceDrop
      </Link>
      <div className="navbar-links">
        
        <Link to="/chat" className="nav-link"> Chat </Link>
        <Link to="/profile" className="nav-link"> Profil </Link>
       
      </div>
    </nav>
  );
};

export default Navbar;