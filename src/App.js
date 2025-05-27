// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // AuthProvider est toujours utile pour gérer currentUser
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/layout/Navbar';
// import ProtectedRoute from './components/layout/ProtectedRoute'; // SUPPRIMÉ
import './App.css';

// Layout pour les pages de chat (Navbar + layout chat spécifique)
const MainChatLayout = () => (
  <div className="app-container">
    <Navbar />
    <div className="page-content-below-navbar">
      <div className="app-layout"> {/* Layout spécifique du chat */}
        <Outlet /> {/* ChatPage sera rendu ici */}
      </div>
    </div>
  </div>
);

// Layout pour les pages de contenu général (Navbar + contenu simple)
const GeneralPageLayout = () => (
  <div className="app-container">
    <Navbar />
    <div className="page-content-below-navbar">
      <div className="simple-content-page"> {/* Classe pour padding/styles des pages simples */}
        <Outlet /> {/* ProfilePage, EditProfilePage, NotFoundPage */}
      </div>
    </div>
  </div>
);

// Layout pour les pages d'authentification (plein écran, pas de Navbar globale)
const AuthLayout = () => (
    <Outlet /> // LoginPage, SignUpPage seront rendues ici
);


function App() {
  return (
    <AuthProvider> {/* Garder AuthProvider pour gérer l'état de l'utilisateur connecté */}
      <Router>
        <Routes>
          {/* Pages d'authentification avec leur propre layout */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            {/* Redirection par défaut vers login si aucune autre route ne correspond au début */}
            <Route path="/chat" element={<LoginPage />} /> 
          </Route>

          {/* Page de Chat avec son layout spécifique */}
          <Route element={<MainChatLayout />}>
            <Route path="/" element={<ChatPage />} />
          </Route>
          
          {/* Pages de Profil et autres pages générales avec Navbar */}
          <Route element={<GeneralPageLayout />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            {/* La page 404 peut aussi utiliser ce layout général */}
            <Route path="*" element={<NotFoundPage />} /> 
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;