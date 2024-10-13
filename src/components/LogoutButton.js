// src/components/LogoutButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out...");
    // Clear the access token and other relevant data from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('verifier');

    // Redirect to the login page
    navigate('/');
  };

  return (
    <button onClick={handleLogout} style={{ margin: '10px' }}>
      Log Out
    </button>
  );
};

export default LogoutButton;
