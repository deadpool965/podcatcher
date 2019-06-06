import React, { useState, useEffect } from 'react';
import Button from '../Button/Button';
import Grid from '../Grid/Grid';
import './UpdateAvailableToast.css';

function UpdateAvailableToast() {
  const [show, setShow] = useState(false);

  function requestUpdate() {
    setShow(false);
    window.dispatchEvent(new CustomEvent('update-request'));
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
          Update available.
        </div>
        <div>
          <Button
            id="update-available-btn"
            onClick={requestUpdate}
            transparent
            accentText
            pointy
          >
            Refresh
          </Button>
        </div>
      </Grid>
    </div>
  );
}

export default UpdateAvailableToast;
