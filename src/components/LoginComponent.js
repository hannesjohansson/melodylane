// src/components/LoginComponent.js
import React from 'react';
import { Button, Box } from '@mui/material';
import { generateCodeVerifier, generateCodeChallenge } from '../authUtils';

const LoginComponent = () => {
  const handleLogin = async () => {
    const verifier = generateCodeVerifier();
    localStorage.setItem('verifier', verifier);
    const challenge = await generateCodeChallenge(verifier);

    const clientId = "184e094404234178b71f56a6b60a44d5";
    const redirectUri = "http://localhost:3000/callback";
    
    const scope = [
      "user-read-private",
      "user-read-email",
      "playlist-read-private",
      "user-read-playback-state",
      "user-modify-playback-state",
      "user-read-currently-playing",
      "streaming"
    ].join(" ");

    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectUri)}&code_challenge_method=S256&code_challenge=${challenge}`;
    
    window.location.href = authUrl;
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Login with Spotify
      </Button>
    </Box>
  );
};

export default LoginComponent;

