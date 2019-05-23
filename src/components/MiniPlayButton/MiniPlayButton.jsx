import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { PlaybackContext } from '../../libs/Store';
import './MiniPlayButton.css';

function MiniPlayButton({
  episode,
}) {
  const { title } = episode;
  const [playback, dispatchPlayback] = useContext(PlaybackContext);

  const isEpisodePlaying = playback.episode
    && playback.episode.title === title
    && playback.status === 'playing';
  const icon = isEpisodePlaying
    ? 'pause'
    : 'play';

  function onClick() {
    if (isEpisodePlaying) {
      dispatchPlayback({
        type: 'pause',
      });
    } else {
      dispatchPlayback({
        type: 'play',
        payload: episode,
      });
    }
  }

  return (
    <button
      type="button"
      className="mini-play-button"
      onClick={onClick}
      aria-label={`Play ${title}`}
    >
      <i className={`icon ion-md-${icon}`} />
    </button>
  );
}

MiniPlayButton.propTypes = {
  episode: PropTypes.shape({
    title: PropTypes.string,
  }).isRequired,
};

export default MiniPlayButton;
