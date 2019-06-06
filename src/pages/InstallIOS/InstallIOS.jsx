import React from 'react';
import Grid from '../../components/Grid/Grid';
import './InstallIOS.css';

function InstallIOS() {
  return (
    <div className="install-ios-page">
      <center>Follow the instructions:</center>
      <ul className="install-ios-page__list">
        <li>
          <Grid columns="1fr 2fr">
            <div className="install-ios-page__list__icon-wrapper">
              <i
                className="icon ion-ios-share"
                aria-hidden
              />
            </div>
            <div className="install-ios-page__list__description">
              {'1. Tap the "Share" button on Safari\'s menu bar'}
            </div>
          </Grid>
        </li>
        <li>
          <Grid columns="1fr 2fr">
            <div className="install-ios-page__list__icon-wrapper">
              <i
                className="icon ion-ios-add"
                aria-hidden
              />
            </div>
            <div className="install-ios-page__list__description">
              {'2. Tap the "Add to Home Screen" icon'}
            </div>
          </Grid>
        </li>
        <li>
          <Grid columns="1fr 2fr">
            <div className="install-ios-page__list__icon-wrapper">
              <i
                className="icon ion-ios-checkmark"
                aria-hidden
              />
            </div>
            <div className="install-ios-page__list__description">
              {'3. Tap "Add" on the Add to Home Screen page'}
            </div>
          </Grid>
        </li>
      </ul>
    </div>
  );
}

export default InstallIOS;
