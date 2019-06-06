import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Container from '../Container/Container';
import Grid from '../Grid/Grid';
import Button from '../Button/Button';
import './InstallBanner.css';

let deferredPrompt;

function InstallBanner({ history }) {
  const [show, setShow] = useState(false);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  function dismissBanner() {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    threeDaysFromNow.setHours(0);
    threeDaysFromNow.setMinutes(0);
    threeDaysFromNow.setSeconds(0);
    localStorage.setItem('dismiss-install', threeDaysFromNow.toString());
    setShow(false);
  }

  function install() {
    if (isIOS) {
      history.push('/install-ios');
      return;
    }

    deferredPrompt.prompt();
    deferredPrompt
      .userChoice
      .then(({ outcome }) => {
        if (outcome === 'dismissed') return;
        deferredPrompt = null;
      });
  }

  useEffect(() => {
    function shouldShow() {
      const installed = localStorage.getItem('installed');
      if (installed) return false;

      const dismissed = localStorage.getItem('dismiss-install');
      if (!dismissed) return true;

      const until = new Date(dismissed);
      return new Date() > until;
    }

    if (isIOS) {
      setShow(shouldShow());
      return () => {};
    }

    function preventInstallPrompt(e) {
      e.preventDefault();
      deferredPrompt = e;
      setShow(shouldShow());
    }

    window.addEventListener('beforeinstallprompt', preventInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', preventInstallPrompt);
    };
  }, [isIOS]);

  if (!show) return null;

  return (
    <div className="install-banner">
      <Container>
        <Grid
          columns="min-content min-content auto min-content"
          style={{
            alignItems: 'center',
            gridGap: '8px',
          }}
        >
          <div>
            <Button
              transparent
              lightText
              circle
              small
              onClick={dismissBanner}
              ariaLabel="Dismiss installation"
            >
              <i
                className="icon ion-md-close"
                aria-hidden
              />
            </Button>
          </div>
          <img
            src="/favicon-ios.png"
            className="install-banner__logo"
            alt="Podcatcher app logo"
          />
          <div>
            <Grid
              rows="2"
              style={{ gridGap: '4px' }}
            >
              <div className="install-banner__overflow-text">
                <b>Install Podcatcher</b>
              </div>
              <div className="install-banner__overflow-text">
                FREE podcast player
              </div>
            </Grid>
          </div>
          <div>
            <Button
              onClick={install}
              small
            >
              Install
            </Button>
          </div>
        </Grid>
      </Container>
    </div>
  );
}

InstallBanner.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default InstallBanner;
