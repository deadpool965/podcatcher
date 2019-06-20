import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import {
  PlaybackContext,
  PLAYBACK_ACTION_TYPE,
  PLAYBACK_STATUS,
} from '../../libs/Store';
import strings from '../../libs/language';
import './PlayButton.css';

function PlayButton({
  episode,
  podcast,
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

  const waiting = isMyEpisode && playback.status
    === PLAYBACK_STATUS.WAITING;

  function onClick(e) {
    e.preventDefault();

    if (waiting) return;

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
      payload: {
        episode,
        podcast,
      },
    });
  }

  function onPressSpace(evt) {
    evt.persist();
    if (evt.key !== ' ') return;
    onClick(evt);
  }

  return (
    <a
      href={episode.enclosures[0].url}
      className={
        `mini-play-button
        ${theme === 'dark' ? ' mini-play-button--dark' : ''}
        ${large ? ' mini-play-button--large' : ''}
        ${waiting ? ' mini-play-button--disabled' : ''}
      `}
      onClick={onClick}
      onKeyDown={onPressSpace}
      aria-label={isMyEpisode && isPlaying ? strings.pause : strings.formatString(strings.playTitle, title)}
      role="button"
      tabIndex={waiting ? '-1' : '0'}
    >
      <i
        className={`icon ion-md-${icon}`}
        aria-hidden
      />
    </a>
  );
}

PlayButton.propTypes = {
  episode: PropTypes.shape({
    title: PropTypes.string,
  }).isRequired,
  podcast: PropTypes.shape({
    artistName: PropTypes.string,
    collectionId: PropTypes.number,
    collectionName: PropTypes.string,
    artworkUrl30: PropTypes.string,
    artworkUrl60: PropTypes.string,
    artworkUrl100: PropTypes.string,
    artworkUrl600: PropTypes.string,
  }).isRequired,
  theme: PropTypes.oneOf(['light', 'dark']),
  large: PropTypes.bool,
};

PlayButton.defaultProps = {
  theme: 'light',
  large: false,
};

export default PlayButton;
