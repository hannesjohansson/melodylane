// src/components/CallbackComponent.js
import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import queryString from 'query-string';

const CallbackComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        // Parsing the authorization code from the URL
        const { code } = queryString.parse(window.location.search);
        const verifier = localStorage.getItem('verifier');
        const clientId = "184e094404234178b71f56a6b60a44d5";
        const redirectUri = "http://localhost:3000/callback";

        if (!code || !verifier) {
          console.error('Authorization code or verifier is missing.');
          return;
        }

        // Exchange the authorization code for an access token
        const response = await axios.post(
          'https://accounts.spotify.com/api/token',
          new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            client_id: clientId,
            code_verifier: verifier,
          }).toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        );

        // Save the token in localStorage
        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);

        // Navigate to playlists
        navigate('/playlists');
      } catch (error) {
        console.error('Error fetching the token:', error);
        alert("There was an issue while logging in. Please try again.");
      }
    };

    fetchToken();
  }, [navigate]);

  return (
    <div>Redirecting...</div>
  );
};

export default CallbackComponent;
