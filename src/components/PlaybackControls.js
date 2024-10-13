import React, { useState, useEffect } from 'react';
import { Box, IconButton, Slider } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';

const PlaybackControls = ({ player, isPlayerReady }) => {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlayerReady && player) {
      console.log("Adding player_state_changed listener");
      const stateListener = player.addListener('player_state_changed', (state) => {
        if (!state) return;

        setProgress(state.position);
        setDuration(state.duration);
        setIsPlaying(!state.paused);

        console.log("Player State Changed:", state);
      });

      return () => {
        console.log("Removing player_state_changed listener");
        if (stateListener) {
          player.removeListener('player_state_changed', stateListener);
        }
      };
    }
  }, [isPlayerReady, player]);

  const handlePlay = () => {
    if (player) {
      player.resume().then(() => {
        console.log('Playback resumed');
      }).catch((error) => {
        console.error("Error resuming playback:", error);
      });
    }
  };

  const handlePause = () => {
    if (player) {
      player.pause().then(() => {
        console.log('Playback paused');
      }).catch((error) => {
        console.error("Error pausing playback:", error);
      });
    }
  };

  const handleStop = () => {
    if (player) {
      player.pause().then(() => {
        console.log('Playback stopped');
        setProgress(0);
      }).catch((error) => {
        console.error("Error stopping playback:", error);
      });
    }
  };

  const handleSliderChange = (event, newValue) => {
    if (player) {
      player.seek(newValue).then(() => {
        console.log(`Changed position to ${newValue}`);
        setProgress(newValue);
      }).catch((error) => {
        console.error("Error seeking track:", error);
      });
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        color: '#fff',
        padding: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box>
        <IconButton onClick={handleStop} color="primary">
          <StopIcon />
        </IconButton>
        {isPlaying ? (
          <IconButton onClick={handlePause} color="primary">
            <PauseIcon />
          </IconButton>
        ) : (
          <IconButton onClick={handlePlay} color="primary">
            <PlayArrowIcon />
          </IconButton>
        )}
        <IconButton onClick={() => player.previousTrack()} color="primary">
          <SkipPreviousIcon />
        </IconButton>
        <IconButton onClick={() => player.nextTrack()} color="primary">
          <SkipNextIcon />
        </IconButton>
      </Box>
      <Box sx={{ width: '50%' }}>
        <Slider
          value={progress}
          max={duration}
          onChange={handleSliderChange}
          sx={{
            color: '#1db954',
          }}
        />
      </Box>
    </Box>
  );
};

export default PlaybackControls;
