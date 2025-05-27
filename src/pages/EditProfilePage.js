// src/pages/EditProfilePage.js
import React from 'react';
import ProfileEditForm from '../components/profile/ProfileEditForm';
import Navbar from '../components/layout/Navbar';

const EditProfilePage = () => {
  return (
    <>
      <div className="profile-page-container"> {/* Réutiliser la classe pour le layout */}
        <ProfileEditForm />
      </div>
    </>
  );
};
export default EditProfilePage;