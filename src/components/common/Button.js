// src/components/common/Button.js
import React from 'react';
import './Button.css'; // Créez ce fichier CSS

const Button = ({ children, onClick, type = "button", variant = "primary", size = "md", disabled = false, isLoading = false, iconLeft, iconRight, fullWidth = false, ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-fullwidth' : ''} ${isLoading ? 'btn-loading' : ''}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="btn-spinner"></span>
      ) : (
        <>
          {iconLeft && <span className="btn-icon btn-icon-left">{iconLeft}</span>}
          {children}
          {iconRight && <span className="btn-icon btn-icon-right">{iconRight}</span>}
        </>
      )}
    </button>
  );
};
export default Button;