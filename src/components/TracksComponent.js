// src/components/TracksComponent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import PlayerComponent from './PlayerComponent';

const TracksComponent = () => {
  const { playlistId } = useParams(); // Get playlistId from route parameters
  const [tracks, setTracks] = useState([]);
  const [accessToken] = useState(localStorage.getItem('access_token'));
  const [deviceId, setDeviceId] = useState(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

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

  const handlePlayerReady = (id) => {
    setDeviceId(id);
    setIsPlayerReady(true);
  };

  // Handle playing the track in the browser
  const handlePlayTrack = async (trackUri) => {
    if (!isPlayerReady || !deviceId) {
      alert('Player is not ready yet. Please wait...');
      return;
    }

    try {
      console.log("Attempting to play track with URI:", trackUri);
      await axios.put(
        'https://api.spotify.com/v1/me/player/play',
        {
          uris: [trackUri]
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          params: {
            device_id: deviceId
          }
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
    <div>
      <h2>Playlist Tracks</h2>
      <LogoutButton />
      <PlayerComponent token={accessToken} onReady={handlePlayerReady} />
      <ul>
        {tracks.map(({ track }) => (
          <li key={track.id}>
            {track.name} - {track.artists.map(artist => artist.name).join(', ')}
            <button onClick={() => handlePlayTrack(track.uri)}>Play</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TracksComponent;
