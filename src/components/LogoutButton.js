// src/components/LogoutButton.js
import React from 'react';
import { Button, Box } from '@mui/material';

const LogoutButton = () => {
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/';
  };

  return (
    <Box sx={{ marginBottom: 2 }}>
      <Button variant="outlined" color="secondary" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
};

export default LogoutButton;
