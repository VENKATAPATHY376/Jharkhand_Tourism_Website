import React, { useState } from "react";
import LandingPage from "./LandingPage.jsx";
import UserLogin from "./UserLogin.jsx";
import BookingPage from "./BookingPage.jsx";
import ARPlaces from "./ARPlaces.jsx";
import "./LandingPage.css";

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const navigateToLogin = () => {
    setCurrentPage('login');
  };

  const navigateToHome = () => {
    setCurrentPage('home');
  };

  const navigateToBooking = () => {
    setCurrentPage('booking');
  };

  const navigateToARPlaces = () => {
    setCurrentPage('ar-places');
  };

  // Add global navigation handlers
  React.useEffect(() => {
    window.navigateToBooking = navigateToBooking;
    window.navigateToHome = navigateToHome;
    window.navigateToARPlaces = navigateToARPlaces;
    
    return () => {
      delete window.navigateToBooking;
      delete window.navigateToHome;
      delete window.navigateToARPlaces;
    };
  }, []);

  if (currentPage === 'login') {
    return <UserLogin onNavigateHome={navigateToHome} />;
  }

  if (currentPage === 'booking') {
    return <BookingPage />;
  }

  if (currentPage === 'ar-places') {
    return <ARPlaces />;
  }

  return <LandingPage onNavigateLogin={navigateToLogin} onNavigateBooking={navigateToBooking} onNavigateARPlaces={navigateToARPlaces} />;
};

export default App;