// src/components/TracksComponent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';

const TracksComponent = () => {
  const { playlistId } = useParams(); // Get playlistId from route parameters
  const [tracks, setTracks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTracks = async () => {
      const token = localStorage.getItem('access_token');
      try {
        console.log("Fetching tracks for playlist:", playlistId);
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("Fetched tracks successfully:", response.data.items);
        setTracks(response.data.items);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Access token expired or unauthorized, redirecting to login...");
          alert('Your session has expired. Please log in again.');
          navigate('/');
        } else {
          console.error('Error fetching tracks:', error);
        }
      }
    };

    fetchTracks();
  }, [playlistId, navigate]);

  // Handle playing the track
  const handlePlayTrack = async (trackUri) => {
    const token = localStorage.getItem('access_token');

    try {
      console.log("Attempting to play track with URI:", trackUri);

      // Check if there is an active device
      const devicesResponse = await axios.get('https://api.spotify.com/v1/me/player/devices', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const devices = devicesResponse.data.devices;
      if (devices.length === 0) {
        console.warn("No active Spotify devices found. Please open Spotify on a device.");
        alert('No active Spotify devices found. Please open Spotify on a device.');
        return;
      }

      console.log("Active devices found:", devices);
      const activeDevice = devices.find(device => device.is_active) || devices[0];
      console.log("Using device for playback:", activeDevice);

      await axios.put(
        'https://api.spotify.com/v1/me/player',
        {
          device_ids: [activeDevice.id],
          play: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Playback transferred to device:", activeDevice.id);

      await axios.put(
        'https://api.spotify.com/v1/me/player/play',
        {
          uris: [trackUri]
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Track is playing successfully!");

    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Access token expired or unauthorized, redirecting to login...");
        alert('Your session has expired. Please log in again.');
        navigate('/');
      } else {
        console.error('Error playing track:', error);

        if (error.response) {
          console.error('Response error data:', error.response.data);
        }

        alert('Could not play the track. Please ensure you have an active Spotify Premium account and a device available for playback.');
      }
    }
  };

  return (
    <div>
      <h2>Playlist Tracks</h2>
      <LogoutButton />
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
