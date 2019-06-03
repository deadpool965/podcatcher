import React, { useContext, useState, Fragment } from 'react';
import { PlaybackContext, PLAYBACK_ACTION_TYPE } from '../../libs/Store';
import Button from '../Button/Button';
import Container from '../Container/Container';
import Grid from '../Grid/Grid';
import PlayButton from '../PlayButton/PlayButton';
import Modal from '../Modal/Modal';
import Range from '../Range/Range';
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
  const [expanded, setExpanded] = useState(false);
  const [showTimerDialog, setShowTimerDialog] = useState(false);
  const [showPlaybackRateDialog, setShowPlaybackRateDialog] = useState(false);
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
    document.getElementById('playback-rate-btn').focus();
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

  if (!playback.episode) return null;

  return (
    <div
      className="player"
      role="navigation"
      aria-label="Player Navigation"
    >
      <Modal
        title="Set Timer"
        open={showTimerDialog}
        onClose={hideTimerDialog}
      >
        <ul className="player__styleless-list">
          {TIMER_OPTIONS
            .map((time) => {
              const label = time === 0
                ? 'Off'
                : `${time} minutes`;
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
        title="Set Playback Rate"
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
              ariaLabel={expanded ? 'Collapse Player' : 'Expand Player'}
            >
              <i
                className={`icon ion-md-arrow-drop${expanded ? 'up' : 'down'}`}
                style={{ fontSize: '24px' }}
              />
            </Button>
            <div
              className="player__title"
              aria-label="Playing"
            >
              {playback.episode.title}
            </div>
            {expanded
              ? null
              : (
                <PlayButton
                  episode={playback.episode}
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
                      aria-label="Current Time"
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
                      label="Progress Bar"
                      onChange={onProgressChange}
                    />
                  </div>
                  <div>
                    <div
                      className="player__time-display"
                      aria-label="Duration"
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
                      ariaLabel="Set Timer"
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
                      ariaLabel="Rewind 15 seconds"
                      onClick={rewind}
                    >
                      <i className="icon ion-md-rewind" />
                    </Button>
                  </div>
                  <PlayButton
                    episode={playback.episode}
                    theme="dark"
                    large
                  />
                  <div>
                    <Button
                      ariaLabel="Fastforward 15 seconds"
                      onClick={fastforward}
                    >
                      <i className="icon ion-md-fastforward" />
                    </Button>
                  </div>
                  <div>
                    <Button
                      id="playback-rate-btn"
                      ariaLabel="Change playback rate"
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
    </div>
  );
}

export default Player;
