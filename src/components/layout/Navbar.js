// src/components/layout/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import { FiMessageSquare, FiUser, FiLogIn, FiUserPlus, FiLogOut, FiMic } from 'react-icons/fi';
import './Navbar.css'; // Créez ce fichier

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to={currentUser ? "/chat" : "/"} className="navbar-brand">
        <FiMic /> VoiceDrop
      </Link>
      <div className="navbar-links">
        {currentUser ? (
          <>
            <Link to="/chat" className="nav-link"><FiMessageSquare /> Chat</Link>
            <Link to="/profile" className="nav-link"><FiUser /> Profil</Link>
            <Button onClick={handleLogout} variant="outline" size="sm" iconLeft={<FiLogOut />}>Déconnexion</Button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link"><FiLogIn /> Connexion</Link>
            <Link to="/signup" className="nav-link">
                <Button variant="primary" size="sm" iconLeft={<FiUserPlus/>}>Inscription</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};
export default Navbar;