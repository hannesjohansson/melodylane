// src/App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import LoginComponent from './components/LoginComponent';
import CallbackComponent from './components/CallbackComponent';
import PlaylistsComponent from './components/PlaylistsComponent';
import TracksComponent from './components/TracksComponent';
import PlayerComponent from './components/PlayerComponent';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginComponent />} />
          <Route path="/callback" element={<CallbackComponent />} />
          <Route path="/playlists" element={<PlaylistsComponent />} />
          <Route path="/playlists/:playlistId" element={<TracksComponent />} />
          <Route path="/player" element={<PlayerComponent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
