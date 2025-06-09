// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import ExploreRoomsPage from './pages/ExploreRoomsPage';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';
import './App.css'; // Importation des styles globaux

// Layout pour les pages qui ont la Navbar et le layout spécifique du chat (ChatPage)
const MainChatLayout = () => (
  // .app-container gère la hauteur 100vh et la direction flex column
  // Navbar vient en premier, puis page-content-below-navbar prend le reste de l'espace
  // <Outlet /> ici rendra ChatPage, qui lui-même retourne <div className="app-layout">...</div>
  <div className="app-container">
    <Navbar />
    <div className="page-content-below-navbar">
      <Outlet /> 
    </div>
  </div>
);

// Layout pour les pages qui ont juste la Navbar et un contenu simple
const GeneralPageLayout = () => ( 
  <div className="app-container">
    <Navbar />
    <div className="page-content-below-navbar">
      {/* .simple-content-page est un enfant de .page-content-below-navbar */}
      <div className="simple-content-page">
        <Outlet />
      </div>
    </div>
  </div>
);

// Layout pour les pages publiques d'authentification (sans Navbar)
const AuthLayout = () => {
    const { currentUser, loading } = useAuth();
    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><LoadingSpinner size="lg" /></div>;
    }
    if (currentUser) { // Si l'utilisateur est déjà connecté, rediriger vers le chat
        return <Navigate to="/chat" replace />;
    }
    return (
        <div className="auth-page-container"> {/* Conteneur optionnel pour styler les pages d'auth */}
            <Outlet />
        </div>
    );
};

// Redirection initiale basée sur l'état d'authentification
const InitialRedirect = () => {
  const { currentUser, loading } = useAuth();
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><LoadingSpinner size="lg" /></div>;
  }
  return currentUser ? <Navigate to="/chat" replace /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Redirection initiale */}
          <Route path="/" element={<InitialRedirect />} />

          {/* Routes d'authentification (sans Navbar principale) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            {/* Ajoutez ici d'autres routes d'auth comme /forgot-password si besoin */}
          </Route>

          {/* Routes protégées avec le layout du Chat */}
          <Route element={<ProtectedRoute><MainChatLayout /></ProtectedRoute>}>
            <Route path="/chat" element={<ChatPage />} />
            {/* Si d'autres pages doivent utiliser le layout à 3 colonnes, ajoutez-les ici */}
          </Route>
          
          {/* Routes protégées avec le layout Général (Navbar + contenu simple) */}
          <Route element={<ProtectedRoute><GeneralPageLayout /></ProtectedRoute>}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route path="/explore-rooms" element={<ExploreRoomsPage />} />
            {/* Ajoutez ici d'autres pages générales comme /settings, /help, etc. */}
          </Route>

          {/* Page 404 - peut utiliser GeneralPageLayout si vous voulez la Navbar, sinon un layout simple */}
          <Route element={<GeneralPageLayout />}> {/* Ou un <SimpleLayoutNoNavbar> si vous préférez */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;