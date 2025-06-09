// src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // Assurez-vous que ce chemin est correct

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) { // Ou context === null si votre AuthContext.Provider peut avoir value={null }
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};