// src/components/common/LoadingSpinner.js
import React from 'react';
import './LoadingSpinner.css'; // Créez ce fichier

const LoadingSpinner = ({ size = "md" }) => {
  return <div className={`loading-spinner spinner-${size}`}></div>;
};
export default LoadingSpinner;
