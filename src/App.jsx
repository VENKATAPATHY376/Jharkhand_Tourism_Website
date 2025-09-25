import React, { useState } from "react";
import LandingPage from "./LandingPage.jsx";
import UserLogin from "./UserLogin.jsx";
import "./LandingPage.css";

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const navigateToLogin = () => {
    setCurrentPage('login');
  };

  const navigateToHome = () => {
    setCurrentPage('home');
  };

  if (currentPage === 'login') {
    return <UserLogin onNavigateHome={navigateToHome} />;
  }

  return <LandingPage onNavigateLogin={navigateToLogin} />;
};

export default App;