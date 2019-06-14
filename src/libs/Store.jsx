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
  ERROR: 'error',
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
  RESET: 'reset',
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
  let src;
  switch (action.type) {
    case PLAYBACK_ACTION_TYPE.REQUEST_LOAD:
      src = action
        .payload
        .enclosures[0]
        .url;
      localForage
        .getItem('downloads', (err, value) => {
          const item = value instanceof Array
            && value.find(i => i.url === src);
          if (err || !item || !item.blob) {
            playbackAudio.src = src.replace(/^http:\/\//, 'https://');
            playbackAudio.play();
            return;
          }

          playbackAudio.src = URL.createObjectURL(item.blob);
          playbackAudio.currentTime = localStorage.getItem(src) || 0;
          playbackAudio.play();
        });
      return {
        ...state,
        episode: action.payload,
        protocolOverride: /^http:\/\//.test(src),
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
      src = state
        .episode
        .enclosures[0]
        .url;
      if (action.payload === playbackAudio.duration) {
        localStorage.removeItem(src);
      } else {
        localStorage.setItem(src, action.payload);
      }
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

    case PLAYBACK_ACTION_TYPE.RESET:
      return { ...defaultPlayback };

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

export const OFFLINE_EPISODES_ACTION_TYPE = {
  LOAD: 'LOAD',
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  UPDATE: 'UPDATE',
  SYNC_WITH_DATABASE: 'SYNC-WITH-DATABASE',
};

export const OfflineEpisodesContext = createContext([]);

const offlineEpisodesReducer = (state, action) => {
  let r;

  switch (action.type) {
    case OFFLINE_EPISODES_ACTION_TYPE.LOAD:
      r = action.payload;
      break;

    case OFFLINE_EPISODES_ACTION_TYPE.ADD:
      r = [
        ...state,
        action.payload,
      ];
      break;

    case OFFLINE_EPISODES_ACTION_TYPE.UPDATE:
      r = [...state]
        .map((episode) => {
          if (episode.url === action.payload.url) {
            return action.payload;
          }

          return episode;
        });
      break;

    case OFFLINE_EPISODES_ACTION_TYPE.REMOVE:
      r = [...state]
        .filter(e => e.url !== action.payload.url);
      break;

    case OFFLINE_EPISODES_ACTION_TYPE.SYNC_WITH_DATABASE:
      r = [...state]
        .map((item) => {
          // Delete request before syncing to
          // database. Database cannot store
          // request. (obviously)
          const ep = item;
          delete ep.request;
          return ep;
        });
      localForage.setItem('downloads', r);
      break;

    default:
      r = state;
      break;
  }

  return r;
};

function Store({ children }) {
  const [playback, dispatchPlayback] = useReducer(playbackReducer, defaultPlayback);
  const [podcastData, setPodcastData] = useState({});
  const [subscriptions, dispatchSubscriptions] = useReducer(
    subscriptionsReducer,
    defaultSubscriptions,
  );
  const [offlineEpisodes, dispatchOfflineEpisodes] = useReducer(
    offlineEpisodesReducer,
    [],
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
    dispatchPlayback({
      type: PLAYBACK_ACTION_TYPE.UPDATE_STATUS,
      payload: PLAYBACK_STATUS.ERROR,
    });
  }

  function onPause() {
    dispatchPlayback({
      type: PLAYBACK_ACTION_TYPE.UPDATE_STATUS,
      payload: PLAYBACK_STATUS.PAUSED,
    });
  }

  function onPlaying() {
    // On iOS the event 'playing' is fired
    // much before the audio is actually playing.
    // Also, the duration changes before
    // the audio is played as well.
    // To fix this, we are going to listen to
    // timeUpdate event twice before dispatching onPlaying.
    playbackAudio.addEventListener('timeupdate', () => {
      playbackAudio.addEventListener('timeupdate', () => {
        dispatchPlayback({
          type: PLAYBACK_ACTION_TYPE.UPDATE_STATUS,
          payload: PLAYBACK_STATUS.PLAYING,
        });
      }, { once: true });
    }, { once: true });
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

  useEffect(() => {
    localForage
      .getItem('downloads', (err, payload) => {
        if (err || !payload) return;
        dispatchOfflineEpisodes({
          type: OFFLINE_EPISODES_ACTION_TYPE.LOAD,
          payload,
        });
      });
  }, []);

  return (
    <PlaybackContext.Provider value={[playback, dispatchPlayback]}>
      <PodcastDataContext.Provider value={[podcastData, setPodcastData]}>
        <SubscriptionsContext.Provider value={[subscriptions, dispatchSubscriptions]}>
          <OfflineEpisodesContext.Provider value={[offlineEpisodes, dispatchOfflineEpisodes]}>
            {children}
          </OfflineEpisodesContext.Provider>
        </SubscriptionsContext.Provider>
      </PodcastDataContext.Provider>
    </PlaybackContext.Provider>
  );
}

Store.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Store;
