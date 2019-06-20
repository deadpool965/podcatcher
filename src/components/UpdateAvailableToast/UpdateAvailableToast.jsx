import React, { useState, useEffect } from 'react';
import Button from '../Button/Button';
import Grid from '../Grid/Grid';
import strings from '../../libs/language';
import './UpdateAvailableToast.css';

function UpdateAvailableToast() {
  const [show, setShow] = useState(false);

  function requestUpdate() {
    setShow(false);
    window.dispatchEvent(new CustomEvent('update-requested'));
  }

  function showToast() {
    setShow(true);
  }

  useEffect(() => {
    window.addEventListener('update-available', showToast);
    return () => window.removeEventListener('update-available', showToast);
  }, []);

  return (
    <div
      className={`update-available-toast ${show
        ? 'update-available-toast--show'
        : ''}`}
    >
      <Grid
        columns="150px min-content"
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="update-available-toast__description">
          {strings.updateAvailable}
          .
        </div>
        <div>
          <Button
            id="update-available-btn"
            onClick={requestUpdate}
            transparent
            accentText
            pointy
          >
            {strings.refresh}
          </Button>
        </div>
      </Grid>
    </div>
  );
}

export default UpdateAvailableToast;
