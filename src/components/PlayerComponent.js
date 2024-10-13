// src/components/PlayerComponent.js
import React, { useEffect, useState } from 'react';

const PlayerComponent = () => {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'Spotify React App Player',
        getOAuthToken: cb => {
          cb(token);
        },
        volume: 0.5,
      });

      setPlayer(spotifyPlayer);

      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });

      spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      spotifyPlayer.connect();
    };

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

  }, []);

  return (
    <div>
      <h2>Spotify Player</h2>
      <button onClick={() => player && player.togglePlay()}>Play / Pause</button>
    </div>
  );
};

export default PlayerComponent;
