import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import {
  PlaybackContext,
  PLAYBACK_ACTION_TYPE,
  PLAYBACK_STATUS,
} from '../../libs/Store';
import './MiniPlayButton.css';

function MiniPlayButton({
  episode,
}) {
  const { title } = episode;
  const [playback, dispatchPlayback] = useContext(PlaybackContext);

  const isMyEpisode = playback.episode
    && playback.episode.title === title;

  const isPlaying = playback.status
    === PLAYBACK_STATUS.PLAYING;

  const icon = isMyEpisode && isPlaying
    ? 'pause'
    : 'play';

  function onClick(e) {
    e.preventDefault();

    if (isMyEpisode) {
      if (isPlaying) {
        dispatchPlayback({
          type: PLAYBACK_ACTION_TYPE.REQUEST_PAUSE,
        });
        return;
      }

      dispatchPlayback({
        type: PLAYBACK_ACTION_TYPE.REQUEST_PLAY,
      });
      return;
    }

    dispatchPlayback({
      type: PLAYBACK_ACTION_TYPE.REQUEST_LOAD,
      payload: episode,
    });
  }

  return (
    <a
      href={episode.enclosures[0].url}
      className="mini-play-button"
      onClick={onClick}
      aria-label={`Play ${title}`}
    >
      <i className={`icon ion-md-${icon}`} />
    </a>
  );
}

MiniPlayButton.propTypes = {
  episode: PropTypes.shape({
    title: PropTypes.string,
  }).isRequired,
};

export default MiniPlayButton;
