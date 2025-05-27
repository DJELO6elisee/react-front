// src/contexts/AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // currentUser est TOUJOURS null. Aucune logique pour le changer.
  const currentUser = null;
  const loading = false; // Pas de chargement à simuler

  // Fonctions factices qui ne font rien ou retournent des erreurs/promesses vides
  const login = async () => {
    console.warn("Auth: Login function is disabled in this mode.");
    return Promise.reject(new Error("Authentification désactivée."));
  };
  const signup = async () => {
    console.warn("Auth: Signup function is disabled in this mode.");
    return Promise.reject(new Error("Authentification désactivée."));
  };
  const logout = () => {
    console.warn("Auth: Logout function is disabled in this mode.");
  };
  const updateUserProfile = async () => {
    console.warn("Auth: UpdateUserProfile function is disabled in this mode.");
    return Promise.resolve(null);
  };

  const value = {
    currentUser, // Toujours null
    loading,     // Toujours false
    login,
    signup,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};