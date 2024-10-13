// src/components/PlaylistsComponent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, CardActions, Button } from '@mui/material';
import LogoutButton from './LogoutButton';

const PlaylistsComponent = () => {
  const [playlists, setPlaylists] = useState([]);
  const [accessToken] = useState(localStorage.getItem('access_token'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        console.log("Fetching playlists...");
        const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        console.log("Fetched playlists successfully:", response.data.items);
        setPlaylists(response.data.items);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    fetchPlaylists();
  }, [accessToken]);

  const handleViewPlaylist = (playlistId) => {
    navigate(`/playlists/${playlistId}`);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Your Playlists
      </Typography>
      <LogoutButton />
      <Box sx={{ marginTop: 3 }}>
        {playlists.map((playlist) => (
          <Card key={playlist.id} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h6">{playlist.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {playlist.tracks.total} tracks
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleViewPlaylist(playlist.id)}
              >
                View Tracks
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default PlaylistsComponent;
