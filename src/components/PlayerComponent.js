// src/components/PlayerComponent.js
import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

const PlayerComponent = ({ token, onReady }) => {
  const [player, setPlayer] = useState(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    const loadSpotifySDK = () => {
      return new Promise((resolve, reject) => {
        if (!window.onSpotifyWebPlaybackSDKReady) {
          console.log("Loading Spotify SDK script...");
          window.onSpotifyWebPlaybackSDKReady = () => {
            console.log("Spotify SDK is ready");
            resolve();
          };

          const script = document.createElement('script');
          script.src = 'https://sdk.scdn.co/spotify-player.js';
          script.async = true;
          script.onload = () => console.log("Spotify SDK script loaded");
          script.onerror = (e) => reject(new Error(`Failed to load Spotify SDK: ${e.message}`));
          document.body.appendChild(script);
        } else if (window.Spotify) {
          resolve();
        }
      });
    };

    const setupPlayer = () => {
      if (window.Spotify && !player) {
        const spotifyPlayer = new window.Spotify.Player({
          name: 'Web Playback SDK',
          getOAuthToken: cb => { cb(token); },
          volume: 0.5,
        });

        setPlayer(spotifyPlayer);

        spotifyPlayer.addListener('ready', ({ device_id }) => {
          console.log('Player is ready with Device ID', device_id);
          setIsPlayerReady(true);
          onReady(device_id, spotifyPlayer);
        });

        spotifyPlayer.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
          setIsPlayerReady(false);
        });

        spotifyPlayer.connect().catch((error) => {
          console.error('Error connecting Spotify player:', error);
        });
      }
    };

    loadSpotifySDK()
      .then(() => {
        setupPlayer();
      })
      .catch((error) => {
        console.error('Error loading Spotify SDK:', error);
      });

    return () => {
      if (player) {
        console.log("Disconnecting player on component unmount");
        player.disconnect();
      }
    };
  }, [token]);

  return (
    <Box sx={{ marginTop: 2 }}>
      {isPlayerReady ? (
        <Typography variant="subtitle1" color="primary">
          Player is ready. Device ID: {player && player._options.id}
        </Typography>
      ) : (
        <Typography variant="subtitle1" color="error">
          Loading player...
        </Typography>
      )}
    </Box>
  );
};

export default PlayerComponent;
