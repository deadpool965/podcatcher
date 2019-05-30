import React, { useContext, useState } from 'react';
import { PlaybackContext, PLAYBACK_ACTION_TYPE } from '../../libs/Store';
import Button from '../Button/Button';
import Container from '../Container/Container';
import Grid from '../Grid/Grid';
import PlayButton from '../PlayButton/PlayButton';
import Modal from '../Modal/Modal';
import './Player.css';

const TIMER_OPTIONS = [
  15,
  30,
  45,
  60,
];

const SPEED_OPTIONS = [
  .25,
  .5,
  .75,
  1,
  1.25,
  1.5,
  1.75,
  2,
  2.25,
  2.5
];

function Player() {
  const [expanded, setExpanded] = useState(false);
  const [showTimerDialog, setShowTimerDialog] = useState(false);
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

  function showPlaybackRateMenu() {

  }

  function hideTimerDialog() {
    setShowTimerDialog(false);
    document.getElementById('timer-btn').focus();
  }

  if (!playback.episode) return null;

  return (
    <div className="player">
      <Modal
        title="Timer"
        open={showTimerDialog}
        onClose={hideTimerDialog}
      >
        <ul className="player__styleless-list">
          {TIMER_OPTIONS
            .map((time) => {
              const label = `${time} minutes`;
              return (
                <li key={time}>
                  <Button
                    fullWidth
                    ariaLabel={label}
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
          rows={`min-content ${expanded ? 'min-content' : ''}`}
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
            <div className="player__title">{playback.episode.title}</div>
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
              <Grid
                style={{ alignItems: 'center' }}
                columns="auto repeat(5, min-content) auto"
              >
                <div />
                <div>
                  <Button
                    id="timer-btn"
                    ariaLabel="Timer"
                    onClick={() => setShowTimerDialog(true)}
                  >
                    <i className="icon ion-md-timer" />
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
                    ariaLabel="Change playback rate"
                    onClick={showPlaybackRateMenu}
                  >
                    <b>
                      {playback.playbackRate}
                      x
                    </b>
                  </Button>
                </div>
                <div />
              </Grid>
            )
            : null}
        </Grid>
      </Container>
    </div>
  );
}

export default Player;
