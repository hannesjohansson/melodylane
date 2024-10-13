// src/components/PlaylistsComponent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';

const PlaylistsComponent = () => {
  const [playlists, setPlaylists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      const token = localStorage.getItem('access_token');
      try {
        console.log("Fetching playlists...");
        const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("Fetched playlists successfully:", response.data.items);
        setPlaylists(response.data.items);
      } catch (error) {
        console.error('Error fetching playlists', error);
      }
    };

    fetchPlaylists();
  }, []);

  // Handle playlist click
  const handlePlaylistClick = (playlistId) => {
    navigate(`/playlists/${playlistId}`);
  };

  return (
    <div>
      <h2>Your Playlists</h2>
      <LogoutButton />
      <ul>
        {playlists.map(playlist => (
          <li key={playlist.id} onClick={() => handlePlaylistClick(playlist.id)} style={{ cursor: 'pointer' }}>
            {playlist.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistsComponent;
