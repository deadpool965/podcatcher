import React from 'react';
import Grid from '../Grid/Grid';
import strings from '../../libs/language';
import './OfflineAlert.css';

function OfflineAlert() {
  return (
    <div className="offline-alert">
      <Grid columns="1fr 2fr">
        <div className="offline-alert__icon">
          <i
            className="icon ion-ios-wifi"
            aria-hidden
          />
        </div>
        <div className="offline-alert__description">
          <b>
            {strings.youAreOffline}
            .
          </b>
          {strings.networkCouldNotBeReached}
          .
        </div>
      </Grid>
    </div>
  );
}

export default OfflineAlert;
