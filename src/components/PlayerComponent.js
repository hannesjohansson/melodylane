// src/components/PlayerComponent.js
import React, { useEffect, useState } from 'react';

const PlayerComponent = ({ token, onReady }) => {
  const [player, setPlayer] = useState(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    // Function to load the Spotify Web Playback SDK script
    const loadSpotifySDK = () => {
      return new Promise((resolve, reject) => {
        // Ensure that the SDK script is not loaded multiple times
        if (!window.onSpotifyWebPlaybackSDKReady) {
          console.log("Loading Spotify SDK script...");
          
          // Define onSpotifyWebPlaybackSDKReady function
          window.onSpotifyWebPlaybackSDKReady = () => {
            console.log("Spotify SDK is ready");
            resolve(); // Resolve the promise when the SDK is ready
          };

          // Create script tag to load Spotify SDK
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

    // Function to setup the Spotify Player
    const setupPlayer = () => {
      if (window.Spotify && !player) {
        try {
          const spotifyPlayer = new window.Spotify.Player({
            name: 'Web Playback SDK',
            getOAuthToken: cb => { cb(token); },
            volume: 0.5,
          });

          setPlayer(spotifyPlayer);

          // Add event listeners to the player
          spotifyPlayer.addListener('ready', ({ device_id }) => {
            console.log('Player is ready with Device ID', device_id);
            setIsPlayerReady(true);
            onReady(device_id, spotifyPlayer);
          });

          spotifyPlayer.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
            setIsPlayerReady(false);
          });

          spotifyPlayer.addListener('initialization_error', ({ message }) => {
            console.error('Failed to initialize', message);
          });

          spotifyPlayer.addListener('authentication_error', ({ message }) => {
            console.error('Failed to authenticate', message);
          });

          spotifyPlayer.addListener('account_error', ({ message }) => {
            console.error('Account error', message);
          });

          spotifyPlayer.addListener('playback_error', ({ message }) => {
            console.error('Playback error', message);
          });

          spotifyPlayer.connect().catch((error) => {
            console.error('Error connecting Spotify player:', error);
          });
        } catch (error) {
          console.error('Exception while setting up Spotify player:', error);
        }
      }
    };

    // Load Spotify SDK and setup player
    loadSpotifySDK()
      .then(() => {
        setupPlayer();
      })
      .catch((error) => {
        console.error('Error loading Spotify SDK:', error);
      });

    // Disconnect player when component is unmounted
    return () => {
      if (player) {
        console.log("Disconnecting player on component unmount");
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
