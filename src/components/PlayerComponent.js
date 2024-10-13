// src/components/PlayerComponent.js
import React, { useEffect, useState } from 'react';

const PlayerComponent = ({ token, onReady }) => {
  const [player, setPlayer] = useState(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: 'Web Playback SDK',
          getOAuthToken: cb => { cb(token); },
          volume: 0.5,
        });

        setPlayer(player);

        player.addListener('ready', ({ device_id }) => {
          console.log('Player is ready with Device ID', device_id);
          setIsPlayerReady(true);
          onReady(device_id);  // Inform parent component that the player is ready
        });

        player.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
          setIsPlayerReady(false);
        });

        player.addListener('initialization_error', ({ message }) => {
          console.error('Failed to initialize', message);
        });

        player.addListener('authentication_error', ({ message }) => {
          console.error('Failed to authenticate', message);
        });

        player.addListener('account_error', ({ message }) => {
          console.error('Account error', message);
        });

        player.addListener('playback_error', ({ message }) => {
          console.error('Playback error', message);
        });

        player.connect();
      };
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [token]);

  return (
    <div>
      {isPlayerReady ? (
        <p>Player is ready. Device ID: {player && player._options.id}</p>
      ) : (
        <p>Loading player...</p>
      )}
    </div>
  );
};

export default PlayerComponent;
