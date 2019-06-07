import React, {
  createContext,
  useReducer,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import localForage from 'localforage';

export const PLAYBACK_STATUS = {
  IDLE: 'idle',
  WAITING: 'waiting',
  PAUSED: 'paused',
  PLAYING: 'playing',
};

export const PLAYBACK_ACTION_TYPE = {
  REQUEST_LOAD: 'request-load',
  REQUEST_PLAY: 'request-play',
  REQUEST_PAUSE: 'request-pause',
  REQUEST_SEEK: 'request-seek',
  REQUEST_RATE_CHANGE: 'request-rate-change',
  UPDATE_STATUS: 'update-status',
  UPDATE_CURRENT_TIME: 'update-current-time',
  UPDATE_RATE: 'update-rate',
  UPDATE_DURATION: 'update-duration',
  SET_TIMER: 'set-timer',
  UNSET_TIMER: 'unset-timer',
};

const playbackAudio = new Audio();

const defaultPlayback = {
  status: PLAYBACK_STATUS.IDLE,
  episode: null,
  currentTime: 0,
  playbackRate: 1,
  duration: 0,
  protocolOverride: false,
  timer: null,
};

export const PlaybackContext = createContext(defaultPlayback);

const playbackReducer = (state, action) => {
  switch (action.type) {
    case PLAYBACK_ACTION_TYPE.REQUEST_LOAD:
      playbackAudio.src = action
        .payload
        .enclosures[0]
        .url
        .replace(/^http:\/\//, 'https://');
      playbackAudio.play();
      return {
        ...state,
        episode: action.payload,
        protocolOverride: /^http:\/\//.test(action
          .payload
          .enclosures[0]
          .url),
      };

    case PLAYBACK_ACTION_TYPE.REQUEST_PLAY:
      playbackAudio.play();
      return state;

    case PLAYBACK_ACTION_TYPE.REQUEST_PAUSE:
      playbackAudio.pause();
      return state;

    case PLAYBACK_ACTION_TYPE.REQUEST_SEEK:
      playbackAudio.currentTime = action.payload;
      return state;

    case PLAYBACK_ACTION_TYPE.REQUEST_RATE_CHANGE:
      playbackAudio.playbackRate = action.payload;
      return state;

    case PLAYBACK_ACTION_TYPE.UPDATE_STATUS:
      return {
        ...state,
        status: action.payload,
      };

    case PLAYBACK_ACTION_TYPE.UPDATE_CURRENT_TIME:
      return {
        ...state,
        currentTime: action.payload,
      };

    case PLAYBACK_ACTION_TYPE.UPDATE_RATE:
      return {
        ...state,
        playbackRate: action.payload,
      };

    case PLAYBACK_ACTION_TYPE.UPDATE_DURATION:
      return {
        ...state,
        duration: action.payload,
      };

    case PLAYBACK_ACTION_TYPE.SET_TIMER:
      if (state.timer) {
        clearTimeout(state.timer);
      }

      return {
        ...state,
        timer: setTimeout(() => {
          playbackAudio.pause();
        }, action.payload * 1000 * 60),
      };

    case PLAYBACK_ACTION_TYPE.UNSET_TIMER:
      if (state.timer) {
        clearTimeout(state.timer);
      }

      return {
        ...state,
        timer: null,
      };

    default:
      return state;
  }
};

export const PodcastDataContext = createContext(null);

export const SUBSCRIPTIONS_ACTION_TYPE = {
  SUBSCRIBE: 'SUBSCRIBE',
  UNSUBSCRIBE: 'UNSUBSCRIBE',
  LOAD: 'LOAD',
};

const subscriptionsReducer = (state, action) => {
  let r;
  switch (action.type) {
    case SUBSCRIPTIONS_ACTION_TYPE.SUBSCRIBE:
      r = [
        ...state,
        action.payload,
      ];
      break;
    case SUBSCRIPTIONS_ACTION_TYPE.UNSUBSCRIBE:
      r = [...state]
        .filter(item => item.id !== action.payload);
      break;
    case SUBSCRIPTIONS_ACTION_TYPE.LOAD:
      r = [
        ...state,
        ...action.payload,
      ];
      break;
    default:
      break;
  }

  if (r) {
    localForage.setItem('subscriptions', r);
    return r;
  }

  return [...state];
};

const defaultSubscriptions = [];

export const SubscriptionsContext = createContext([]);

function Store({ children }) {
  const [playback, dispatchPlayback] = useReducer(playbackReducer, defaultPlayback);
  const [podcastData, setPodcastData] = useState({});
  const [subscriptions, dispatchSubscriptions] = useReducer(
    subscriptionsReducer,
    defaultSubscriptions,
  );

  function onDurationChange() {
    dispatchPlayback({
      type: PLAYBACK_ACTION_TYPE.UPDATE_DURATION,
      payload: playbackAudio.duration,
    });
  }

  function onEnded() {
    dispatchPlayback({
      type: PLAYBACK_ACTION_TYPE.UPDATE_CURRENT_TIME,
      payload: playbackAudio.duration,
    });
  }

  function onError() {

  }

  function onPause() {
    dispatchPlayback({
      type: PLAYBACK_ACTION_TYPE.UPDATE_STATUS,
      payload: PLAYBACK_STATUS.PAUSED,
    });
  }

  function onPlaying() {
    dispatchPlayback({
      type: PLAYBACK_ACTION_TYPE.UPDATE_STATUS,
      payload: PLAYBACK_STATUS.PLAYING,
    });
  }

  function onRateChange() {
    dispatchPlayback({
      type: PLAYBACK_ACTION_TYPE.UPDATE_RATE,
      payload: playbackAudio.playbackRate,
    });
  }

  function onTimeUpdate() {
    dispatchPlayback({
      type: PLAYBACK_ACTION_TYPE.UPDATE_CURRENT_TIME,
      payload: playbackAudio.currentTime,
    });
  }

  function onWaiting() {
    dispatchPlayback({
      type: PLAYBACK_ACTION_TYPE.UPDATE_STATUS,
      payload: PLAYBACK_STATUS.WAITING,
    });
  }

  useEffect(() => {
    playbackAudio.addEventListener('durationchange', onDurationChange);
    playbackAudio.addEventListener('ended', onEnded);
    playbackAudio.addEventListener('error', onError);
    playbackAudio.addEventListener('pause', onPause);
    playbackAudio.addEventListener('playing', onPlaying);
    playbackAudio.addEventListener('ratechange', onRateChange);
    playbackAudio.addEventListener('timeupdate', onTimeUpdate);
    playbackAudio.addEventListener('waiting', onWaiting);

    return () => {
      playbackAudio.removeEventListener('durationchange', onDurationChange);
      playbackAudio.removeEventListener('ended', onEnded);
      playbackAudio.removeEventListener('error', onError);
      playbackAudio.removeEventListener('pause', onPause);
      playbackAudio.removeEventListener('playing', onPlaying);
      playbackAudio.removeEventListener('ratechange', onRateChange);
      playbackAudio.removeEventListener('timeupdate', onTimeUpdate);
      playbackAudio.removeEventListener('waiting', onWaiting);
    };
  }, []);

  useEffect(() => {
    localForage
      .getItem('subscriptions', (err, payload) => {
        if (err || !payload) return;
        dispatchSubscriptions({
          type: SUBSCRIPTIONS_ACTION_TYPE.LOAD,
          payload,
        });
      });
  }, []);

  return (
    <PlaybackContext.Provider value={[playback, dispatchPlayback]}>
      <PodcastDataContext.Provider value={[podcastData, setPodcastData]}>
        <SubscriptionsContext.Provider value={[subscriptions, dispatchSubscriptions]}>
          {children}
        </SubscriptionsContext.Provider>
      </PodcastDataContext.Provider>
    </PlaybackContext.Provider>
  );
}

Store.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Store;
