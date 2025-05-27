// src/components/layout/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner'; // Pour l'état de chargement

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  let location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentUser) {
    // Redirige vers la page de connexion, mais sauvegarde l'emplacement actuel
    // pour pouvoir y retourner après la connexion.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
export default ProtectedRoute;