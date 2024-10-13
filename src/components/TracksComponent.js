// src/components/TracksComponent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import PlayerComponent from './PlayerComponent';
import PlaybackControls from './PlaybackControls';
import { Box, Typography, Card, CardContent, CardActions, Button } from '@mui/material';

const TracksComponent = () => {
  const { playlistId } = useParams();
  const [tracks, setTracks] = useState([]);
  const [accessToken] = useState(localStorage.getItem('access_token'));
  const [deviceId, setDeviceId] = useState(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        console.log("Fetching tracks for playlist:", playlistId);
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        console.log("Fetched tracks successfully:", response.data.items);
        setTracks(response.data.items);
      } catch (error) {
        console.error('Error fetching tracks:', error);
      }
    };

    fetchTracks();
  }, [playlistId, accessToken]);

  const handlePlayerReady = (id, playerInstance) => {
    setDeviceId(id);
    setPlayer(playerInstance);
    setIsPlayerReady(true);
  };

  const handlePlayTrack = async (trackUri) => {
    if (!isPlayerReady || !deviceId) {
      alert('Player is not ready yet. Please wait...');
      return;
    }

    try {
      console.log("Attempting to play track with URI:", trackUri);
      await axios.put(
        'https://api.spotify.com/v1/me/player/play',
        { uris: [trackUri] },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          params: { device_id: deviceId }
        }
      );

      console.log("Track is playing successfully in the browser!");
    } catch (error) {
      console.error('Error playing track:', error);
      if (error.response) {
        console.error('Response error data:', error.response.data);
      }
      alert('Could not play the track. Please ensure you have a Spotify Premium account and the player is ready.');
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Playlist Tracks
      </Typography>
      <LogoutButton />
      <PlayerComponent token={accessToken} onReady={handlePlayerReady} />
      <Box sx={{ marginTop: 3 }}>
        {tracks.map(({ track }) => (
          <Card key={track.id} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h6">{track.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {track.artists.map(artist => artist.name).join(', ')}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handlePlayTrack(track.uri)}
              >
                Play
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
      {isPlayerReady && player && (
        <PlaybackControls player={player} isPlayerReady={isPlayerReady} />
      )}
    </Box>
  );
};

export default TracksComponent;
