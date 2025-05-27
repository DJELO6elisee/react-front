// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
// import { AuthProvider } from './contexts/AuthContext'; // SUPPRIMÉ
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/layout/Navbar';
// ProtectedRoute n'est plus utilisé
import './App.css';

const MainChatLayout = () => (
  <div className="app-container">
    <Navbar /> {/* Navbar devra gérer l'absence de currentUser */}
    <div className="page-content-below-navbar">
      <div className="app-layout">
        <Outlet />
      </div>
    </div>
  </div>
);

const GeneralPageLayout = () => (
  <div className="app-container">
    <Navbar /> {/* Navbar devra gérer l'absence de currentUser */}
    <div className="page-content-below-navbar">
      <div className="simple-content-page">
        <Outlet />
      </div>
    </div>
  </div>
);

const AuthLayout = () => (
    <Outlet />
);

function App() {
  return (
    // AuthProvider a été supprimé d'ici
    <Router>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          {/* <Route path="/login" element={<LoginPage />} /> */}
        </Route>

        <Route element={<MainChatLayout />}>
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/" element={<ChatPage />} />
        </Route>
        
        <Route element={<GeneralPageLayout />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;