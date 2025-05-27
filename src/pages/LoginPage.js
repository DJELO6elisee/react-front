// src/pages/LoginPage.js
import React from 'react';
import AuthFormLayout from '../components/auth/AuthFormLayout';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <AuthFormLayout
      title="Bienvenue !"
      footerText="Pas encore de compte ?"
      footerLink={{ to: "/signup", text: "Inscrivez-vous" }}
    >
      <LoginForm />
    </AuthFormLayout>
  );
};
export default LoginPage;