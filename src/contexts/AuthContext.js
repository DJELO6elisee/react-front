// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { usersData } from '../data/mockData'; // Pour simuler un utilisateur

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Pour simuler un chargement initial

  // Simuler la vérification de l'état d'authentification au chargement
  useEffect(() => {
    const storedUser = localStorage.getItem('chatUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    // Simulation de connexion : vérifiez si l'utilisateur existe dans mockData
    // Dans une vraie app, ce serait un appel API
    return new Promise((resolve, reject) => {
      setLoading(true);
      setTimeout(() => { // Simule la latence réseau
        const userKey = Object.keys(usersData).find(
          key => usersData[key].name.toLowerCase() === username.toLowerCase() // Connexion simple par nom
        );
        if (userKey && password === "password123") { // Mot de passe factice
          const loggedInUser = { ...usersData[userKey], email: `${username.toLowerCase()}@example.com` }; // Ajout d'un email factice
          setCurrentUser(loggedInUser);
          localStorage.setItem('chatUser', JSON.stringify(loggedInUser));
          setLoading(false);
          resolve(loggedInUser);
        } else {
          setLoading(false);
          reject(new Error("Nom d'utilisateur ou mot de passe incorrect."));
        }
      }, 1000);
    });
  };

  const signup = (userData) => {
    // Simulation d'inscription
    return new Promise((resolve, reject) => {
      setLoading(true);
      setTimeout(() => {
        // Vérifier si le nom d'utilisateur ou l'email est déjà pris (simulation)
        const usernameExists = Object.values(usersData).some(u => u.name.toLowerCase() === userData.username.toLowerCase());
        if (usernameExists) {
          setLoading(false);
          return reject(new Error("Ce nom d'utilisateur est déjà pris."));
        }
        // Dans une vraie app, vous créeriez un nouvel utilisateur dans la BDD
        const newUserId = `user${Date.now()}`;
        const newUser = {
          id: newUserId,
          name: userData.username,
          avatarUrl: userData.avatarUrl || `https://i.pravatar.cc/150?u=${newUserId}`,
          email: userData.email,
          // Ajoutez d'autres champs de profil ici (age, sexe, etc.)
          age: userData.age || null,
          gender: userData.gender || '',
          interests: userData.interests || [],
          relationshipIntent: userData.relationshipIntent || '',
          location: userData.location || '',
        };
        usersData[newUserId] = newUser; // Ajout aux données mock (non persistant après rechargement)
        setCurrentUser(newUser);
        localStorage.setItem('chatUser', JSON.stringify(newUser));
        setLoading(false);
        resolve(newUser);
      }, 1500);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('chatUser');
  };

  const updateUserProfile = (updatedData) => {
    // Simulation de la mise à jour du profil
    return new Promise((resolve) => {
      setLoading(true);
      setTimeout(() => {
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updatedData };
          setCurrentUser(updatedUser);
          localStorage.setItem('chatUser', JSON.stringify(updatedUser));
          // Mettre à jour usersData aussi pour la simulation (non persistant)
          if (usersData[currentUser.id]) {
            usersData[currentUser.id] = updatedUser;
          }
        }
        setLoading(false);
        resolve(currentUser);
      }, 500);
    });
  };


  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};