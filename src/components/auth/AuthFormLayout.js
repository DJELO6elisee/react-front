// src/components/auth/AuthFormLayout.js
import React from 'react';
import { Link } from 'react-router-dom';
// import { FiMic } from 'react-icons/fi'; // Ou une autre icône de votre app
import './AuthFormLayout.css'; // Créez ce fichier

const AuthFormLayout = ({ title, children, footerLink, footerText }) => {
  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          {/* <FiMic size={32} className="auth-logo-icon" /> */}
          <h1 className="auth-app-title">ChatGather</h1> {/* Ou le nom de votre app */}
        </div>
        <h2 className="auth-form-title">{title}</h2>
        {children}
        {footerText && footerLink && (
          <p className="auth-footer-text">
            {footerText} <Link to={footerLink.to} className="auth-link">{footerLink.text}</Link>
          </p>
        )}
      </div>
    </div>
  );
};
export default AuthFormLayout;