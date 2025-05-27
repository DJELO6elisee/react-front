// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import './App.css'; // Styles globaux, y compris .app-container et .page-content-below-navbar

// Layout pour les pages qui ont la Navbar et le layout spécifique du chat
const MainChatLayout = () => (
  <div className="app-container"> {/* Conteneur global pour Navbar + contenu */}
    <Navbar />
    <div className="page-content-below-navbar"> {/* Conteneur pour le contenu SOUS la navbar */}
      <div className="app-layout"> {/* C'est le layout du chat (sidebar, chatarea, sidebarRight) */}
        <Outlet /> {/* ChatPage sera rendu ici */}
      </div>
    </div>
  </div>
);

// Layout pour les pages protégées qui ont juste la Navbar et un contenu simple
const ProtectedContentLayout = () => (
  <div className="app-container">
    <Navbar />
    <div className="page-content-below-navbar simple-content-page"> {/* Classe pour un padding général */}
      <Outlet /> {/* ProfilePage, EditProfilePage */}
    </div>
  </div>
);

// Layout pour les pages publiques (pas de Navbar globale ici, gérée par la page elle-même si besoin)
const PublicLayout = () => (
    <Outlet />
);


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes Publiques */}
          <Route element={<PublicLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/" element={<LoginPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
          </Route>

          {/* Routes Protégées avec le layout de chat */}
          <Route element={<ProtectedRoute><MainChatLayout /></ProtectedRoute>}>
            <Route path="/chat" element={<ChatPage />} />
          </Route>
          
          {/* Routes Protégées avec un layout de contenu simple */}
          <Route element={<ProtectedRoute><ProtectedContentLayout /></ProtectedRoute>}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
          </Route>

          {/* Page 404 - Pourrait aussi avoir un layout spécifique ou utiliser ProtectedContentLayout */}
          <Route path="*" element={
            <div className="app-container">
                <Navbar /> {/* Assumant que Navbar est visible même sur 404 si l'user est loggé */}
                <div className="page-content-below-navbar simple-content-page">
                    <NotFoundPage />
                </div>
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;