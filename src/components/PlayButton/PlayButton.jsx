import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import {
  PlaybackContext,
  PLAYBACK_ACTION_TYPE,
  PLAYBACK_STATUS,
} from '../../libs/Store';
import './PlayButton.css';

function PlayButton({
  episode,
  theme,
  large,
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

  function onPressSpace(evt) {
    evt.persist();
    evt.preventDefault();
    if (evt.key !== ' ') return;
    onClick(evt);
  }

  return (
    <a
      href={episode.enclosures[0].url}
      className={
        `mini-play-button
        ${theme === 'dark'
          ? ' mini-play-button--dark'
          : ''}
        ${large
            ? ' mini-play-button--large'
            : ''}
      `}
      onClick={onClick}
      onKeyDown={onPressSpace}
      aria-label={`Play ${title}`}
      role="button"
    >
      <i className={`icon ion-md-${icon}`} />
    </a>
  );
}

PlayButton.propTypes = {
  episode: PropTypes.shape({
    title: PropTypes.string,
  }).isRequired,
  theme: PropTypes.oneOf(['light', 'dark']),
  large: PropTypes.bool,
};

PlayButton.defaultProps = {
  theme: 'light',
  large: false,
};

export default PlayButton;
