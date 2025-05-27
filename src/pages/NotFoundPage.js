// src/pages/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px', minHeight: 'calc(100vh - 120px)' }}> {/* Moins Navbar et Footer */}
      <FiAlertTriangle size={60} style={{ color: 'var(--danger-color, #EF4444)', marginBottom: '20px' }} />
      <h1>404 - Page non trouvée</h1>
      <p>Désolé, la page que vous recherchez n'existe pas.</p>
      <Link to={localStorage.getItem('chatUser') ? "/chat" : "/login"}>
        <button className="btn btn-primary" style={{marginTop: '20px'}}>Retour à l'accueil</button>
      </Link>
    </div>
  );
};
export default NotFoundPage;