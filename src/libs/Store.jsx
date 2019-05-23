import React, {
  createContext,
  useReducer,
} from 'react';
import PropTypes from 'prop-types';

const playbackAudio = new Audio();

const defaultPlayback = {
  status: 'idle',
  episode: null,
  currentTime: 0,
};

export const PlaybackContext = createContext(defaultPlayback);

const playbackReducer = (state, action) => {
  switch (action.type) {
    case 'play':
      if (playbackAudio.src !== action.payload.enclosures[0].url) {
        playbackAudio.src = action.payload.enclosures[0].url;
      }
      playbackAudio.play();
      return {
        ...state,
        status: 'playing',
        episode: action.payload,
      };
    case 'pause':
      playbackAudio.pause();
      return {
        ...state,
        status: 'paused',
      };
    default:
      return state;
  }
};

function Store({ children }) {
  const [playback, dispatchPlayback] = useReducer(playbackReducer, defaultPlayback);

  return (
    <PlaybackContext.Provider value={[playback, dispatchPlayback]}>
      {children}
    </PlaybackContext.Provider>
  );
}

Store.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Store;
