// src/pages/ProfilePage.js
import React from 'react';
import ProfileDisplay from '../components/profile/ProfileDisplay';
// import Navbar from '../components/layout/Navbar'; 

const ProfilePage = () => {
  return (
    <>
      {/* Navbar sera sur toutes les pages protégées */}
      <div className="profile-page-container"> {/* Classe pour centrer le contenu */}
        <ProfileDisplay />
      </div>
    </>
  );
};
export default ProfilePage;