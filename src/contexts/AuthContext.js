// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Importer axios
// import { usersData } from '../data/mockData'; // Plus utilisé pour l'initialisation

// L'URL de base de votre API backend
const API_URL = process.env.REACT_APP_API_URL || 'https://chatgather.p6-groupeb.com/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken')); // Charger le token depuis localStorage
  const [loading, setLoading] = useState(true); // Pour le chargement initial de l'utilisateur

  // Fonction pour configurer les headers Axios avec le token
  const setAuthToken = useCallback((newToken) => {
    if (newToken) {
      localStorage.setItem('authToken', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setToken(newToken); // Mettre à jour l'état local du token
    } else {
      localStorage.removeItem('authToken');
      delete axios.defaults.headers.common['Authorization'];
      setToken(null);
    }
  }, []);

  // Vérifier l'utilisateur au chargement de l'application si un token existe
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        setAuthToken(token); // Assurer que le header est configuré
        try {
          const response = await axios.get(`${API_URL}/auth/me`); // Endpoint pour obtenir l'utilisateur connecté
          setCurrentUser(response.data.user);
        } catch (error) {
          console.error("Erreur lors de la récupération de l'utilisateur avec token:", error);
          setAuthToken(null); // Token invalide ou expiré, le supprimer
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };
    fetchCurrentUser();
  }, [token, setAuthToken]);


  const signup = async (signupData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, signupData);
      // Le backend devrait renvoyer { user, token }
      if (response.data && response.data.user && response.data.token) {
        setCurrentUser(response.data.user);
        setAuthToken(response.data.token); // Stocke le token et configure Axios
        setLoading(false);
        return response.data.user; // Renvoyer l'utilisateur pour la redirection, etc.
      } else {
        throw new Error("Réponse invalide du serveur après l'inscription.");
      }
    } catch (error) {
      setLoading(false);
      // Tenter d'extraire le message d'erreur du backend
      const errorMessage = error.response?.data?.message || 
      (error.response?.data?.errors ? error.response.data.errors[0].msg : error.message) ||
      "Échec de l'inscription.";
      throw new Error(errorMessage);
    }
  };

  const login = async (usernameOrEmail, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { usernameOrEmail, password });
      if (response.data && response.data.user && response.data.token) {
        setCurrentUser(response.data.user);
        setAuthToken(response.data.token);
        setLoading(false);
        return response.data.user;
      } else {
        throw new Error("Réponse invalide du serveur après la connexion.");
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message ||
                           (error.response?.data?.errors ? error.response.data.errors[0].msg : error.message) ||
                           "Échec de la connexion.";
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthToken(null); // Supprime le token de localStorage et des headers Axios
    // Optionnel: faire un appel API pour invalider le token côté serveur si votre backend le gère
  };

  const updateUserProfile = async (updatedData) => {
    if (!token) throw new Error("Utilisateur non authentifié pour la mise à jour du profil.");
    setLoading(true);
    try {
      // L'endpoint /users/me est protégé et utilise le token dans les headers
      const response = await axios.put(`${API_URL}/users/me`, updatedData);
      if (response.data && response.data.user) {
        setCurrentUser(response.data.user); // Mettre à jour l'utilisateur dans le contexte
        // Mettre à jour aussi dans localStorage si vous y stockez l'objet user complet
        localStorage.setItem('chatUser', JSON.stringify(response.data.user)); // Si vous stockez plus que le token
        setLoading(false);
        return response.data.user;
      } else {
        throw new Error("Réponse invalide du serveur après la mise à jour du profil.");
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message ||
      (error.response?.data?.errors ? error.response.data.errors[0].msg : error.message) ||
      "Échec de la mise à jour du profil.";
      throw new Error(errorMessage);
    }
  };


  const value = {
    currentUser,
    token, // Exposer le token si d'autres parties de l'app en ont besoin directement
    loading,
    login,
    signup,
    logout,
    updateUserProfile,
    setAuthToken // Exposer pour une gestion manuelle du token si nécessaire
  };

  // Important : ne pas rendre les enfants tant que le chargement initial n'est pas terminé
  // pour éviter les flashs d'UI ou les accès prématurés aux routes.
  return (
    <AuthContext.Provider value={value}>
      {/* Vous pourriez vouloir afficher un spinner global ici si loading est true */}
      {/* Pour l'instant, on rend les enfants directement si loading est géré par ProtectedRoute */}
      {children}
    </AuthContext.Provider>
  );
};