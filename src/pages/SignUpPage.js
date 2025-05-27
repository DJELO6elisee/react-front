// src/pages/SignUpPage.js
import React from 'react';
import AuthFormLayout from '../components/auth/AuthFormLayout';
import SignUpForm from '../components/auth/SignUpForm';

const SignUpPage = () => {
  return (
    <AuthFormLayout
      title="Créez votre compte"
      footerText="Déjà un compte ?"
      footerLink={{ to: "/login", text: "Connectez-vous" }}
    >
      <SignUpForm />
    </AuthFormLayout>
  );
};
export default SignUpPage;