import React, {
  useContext,
  useState,
  useEffect,
  Fragment,
} from 'react';
import {
  PlaybackContext,
  PLAYBACK_ACTION_TYPE,
  PLAYBACK_STATUS,
} from '../../libs/Store';
import Button from '../Button/Button';
import Container from '../Container/Container';
import Grid from '../Grid/Grid';
import PlayButton from '../PlayButton/PlayButton';
import Modal from '../Modal/Modal';
import Range from '../Range/Range';
import strings from '../../libs/language';
import './Player.css';

const TIMER_OPTIONS = [
  0,
  15,
  30,
  45,
  60,
];

const SPEED_OPTIONS = [
  1,
  1.5,
  1.75,
  2,
];

function Player() {
  const [expanded, setExpanded] = useState(true);
  const [showTimerDialog, setShowTimerDialog] = useState(false);
  const [showPlaybackRateDialog, setShowPlaybackRateDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [playback, dispatchPlayback] = useContext(PlaybackContext);

  function formatTimeOutput(s) {
    let seconds = s;
    let hours = Math.floor(seconds / (60 * 60));
    seconds -= hours * 60 * 60;
    let minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    // Pretty number, leading 0 when n < 10
    hours = `0${hours}`.substr(-2);
    minutes = `0${minutes}`.substr(-2);
    seconds = `0${Math.floor(seconds)}`.substr(-2);

    return `${hours}:${minutes}:${seconds}`;
  }

  const currentTime = formatTimeOutput(playback.currentTime);
  const duration = formatTimeOutput(playback.duration);

  function toggleExpand() {
    setExpanded(!expanded);
  }

  function fastforward() {
    let payload = playback.currentTime + 15;
    if (payload > playback.duration) payload = playback.duration;

    dispatchPlayback({
      type: PLAYBACK_ACTION_TYPE.REQUEST_SEEK,
      payload,
    });
  }

  function rewind() {
    let payload = playback.currentTime - 15;
    if (payload < 0) payload = 0;

    dispatchPlayback({
      type: PLAYBACK_ACTION_TYPE.REQUEST_SEEK,
      payload,
    });
  }

  function hideTimerDialog() {
    setShowTimerDialog(false);
    document.getElementById('timer-btn').focus();
  }

  function setTimer(time) {
    if (time === 0) {
      dispatchPlayback({
        type: PLAYBACK_ACTION_TYPE.UNSET_TIMER,
      });
    } else {
      dispatchPlayback({
        type: PLAYBACK_ACTION_TYPE.SET_TIMER,
        payload: time,
      });
    }

    hideTimerDialog();
  }

  function hidePlaybackRateDialog() {
    setShowPlaybackRateDialog(false);
    const btn = document.getElementById('playback-rate-btn');
    if (btn) btn.focus();
  }

  function setPlaybackRate(speed) {
    dispatchPlayback({
      type: PLAYBACK_ACTION_TYPE.REQUEST_RATE_CHANGE,
      payload: speed,
    });
    hidePlaybackRateDialog();
  }

  function onProgressChange(payload) {
    dispatchPlayback({
      type: PLAYBACK_ACTION_TYPE.REQUEST_PAUSE,
      payload,
    });
    dispatchPlayback({
      type: PLAYBACK_ACTION_TYPE.UPDATE_CURRENT_TIME,
      payload,
    });
    dispatchPlayback({
      type: PLAYBACK_ACTION_TYPE.REQUEST_SEEK,
      payload,
    });
    dispatchPlayback({
      type: PLAYBACK_ACTION_TYPE.REQUEST_PLAY,
    });
  }

  function shortcutsPressed({ key, target }) {
    const ignoreTargets = ['INPUT', 'SELECT', 'TEXTAREA'];
    const { tagName } = target;
    if (ignoreTargets.indexOf(tagName) > -1) return;
    switch (key) {
      case 'P':
      case 'p':
        if (playback.status === PLAYBACK_STATUS.PLAYING) {
          dispatchPlayback({
            type: PLAYBACK_ACTION_TYPE.REQUEST_PAUSE,
          });
        } else if (playback.status === PLAYBACK_STATUS.PAUSED) {
          dispatchPlayback({
            type: PLAYBACK_ACTION_TYPE.REQUEST_PLAY,
          });
        }
        break;
      case ',':
        rewind();
        break;
      case '.':
        fastforward();
        break;
      case '1':
        setPlaybackRate(1);
        break;
      case '2':
        setPlaybackRate(1.25);
        break;
      case '3':
        setPlaybackRate(1.75);
        break;
      case '4':
        setPlaybackRate(2);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    if (!playback.episode) {
      return () => {};
    }

    window.addEventListener('keydown', shortcutsPressed);
    return () => {
      window.removeEventListener('keydown', shortcutsPressed);
    };
  });

  function hideErrorDialog() {
    setShowErrorDialog(false);
    dispatchPlayback({
      type: PLAYBACK_ACTION_TYPE.RESET,
    });
  }

  useEffect(() => {
    if (playback.status !== PLAYBACK_STATUS.ERROR) return;
    setShowErrorDialog(true);
  }, [playback.status, showErrorDialog]);

  if (!playback.episode) return null;

  return (
    <div
      className="player"
      role="navigation"
      aria-label={strings.playerNavigation}
    >
      <Modal
        title={strings.setTimer}
        open={showTimerDialog}
        onClose={hideTimerDialog}
      >
        <ul className="player__styleless-list">
          {TIMER_OPTIONS
            .map((time) => {
              const label = time === 0
                ? strings.timerOff
                : strings.formatString(strings.xMinutes, time);
              return (
                <li key={time}>
                  <Button
                    fullWidth
                    ariaLabel={label}
                    onClick={() => setTimer(time)}
                  >
                    {label}
                  </Button>
                </li>
              );
            })}
        </ul>
      </Modal>
      <Modal
        title={strings.setPlaybackRate}
        open={showPlaybackRateDialog}
        onClose={hidePlaybackRateDialog}
      >
        <ul className="player__styleless-list">
          {SPEED_OPTIONS
            .map((speed) => {
              const label = `${speed}x`;
              return (
                <li key={speed}>
                  <Button
                    fullWidth
                    ariaLabel={label}
                    onClick={() => setPlaybackRate(speed)}
                  >
                    {label}
                  </Button>
                </li>
              );
            })}
        </ul>
      </Modal>
      <Modal
        title={strings.error}
        open={showErrorDialog}
        onClose={hideErrorDialog}
      >
        {strings.errorAudioStream}
      </Modal>
      <Container>
        <Grid
          style={{ gridGap: '8px' }}
          rows={`min-content ${expanded ? 'repeat(2, min-content)' : ''}`}
        >
          <Grid
            columns="min-content auto min-content"
            style={{ alignItems: 'center' }}
          >
            <Button
              onClick={toggleExpand}
              ariaLabel={expanded ? strings.collapsePlayer : strings.expandPlayer}
            >
              <i
                className={`icon ion-md-arrow-drop${expanded ? 'up' : 'down'}`}
                style={{ fontSize: '24px' }}
              />
            </Button>
            <div className="player__title">
              {playback.episode.title}
            </div>
            {expanded
              ? null
              : (
                <PlayButton
                  episode={playback.episode}
                  podcast={playback.podcast}
                  theme="dark"
                />
              )
            }
          </Grid>
          {expanded
            ? (
              <Fragment>
                <Grid
                  style={{ alignItems: 'center' }}
                  columns="min-content auto min-content"
                >
                  <div>
                    <div
                      className="player__time-display"
                    >
                      {currentTime}
                    </div>
                  </div>
                  <div>
                    <Range
                      value={playback.currentTime}
                      min={0}
                      max={playback.duration}
                      step={15}
                      label={strings.progressBar}
                      onChange={onProgressChange}
                    />
                  </div>
                  <div>
                    <div
                      className="player__time-display"
                    >
                      {duration}
                    </div>
                  </div>
                </Grid>
                <Grid
                  style={{ alignItems: 'center' }}
                  columns="auto repeat(5, min-content) auto"
                >
                  <div />
                  <div>
                    <Button
                      id="timer-btn"
                      ariaLabel={strings.setTimer}
                      onClick={() => setShowTimerDialog(true)}
                    >
                      <i
                        className="icon ion-md-timer"
                        aria-hidden
                      />
                    </Button>
                  </div>
                  <div>
                    <Button
                      ariaLabel={strings.rewind15Seconds}
                      onClick={rewind}
                    >
                      <i className="icon ion-md-rewind" />
                    </Button>
                  </div>
                  <PlayButton
                    episode={playback.episode}
                    podcast={playback.podcast}
                    theme="dark"
                    large
                  />
                  <div>
                    <Button
                      ariaLabel={strings.Fastforward15Seconds}
                      onClick={fastforward}
                    >
                      <i className="icon ion-md-fastforward" />
                    </Button>
                  </div>
                  <div>
                    <Button
                      id="playback-rate-btn"
                      ariaLabel={strings.setPlaybackRate}
                      onClick={() => setShowPlaybackRateDialog(true)}
                    >
                      <b>
                        {playback.playbackRate}
                        x
                      </b>
                    </Button>
                  </div>
                  <div />
                </Grid>
              </Fragment>
            )
            : null}
        </Grid>
      </Container>
      {playback.status === PLAYBACK_STATUS.WAITING
        ? (
          <div
            className="player__activity"
            aria-hidden
          >
            <div className="player__activity__bar" />
          </div>
        )
        : null}
    </div>
  );
}

export default Player;
