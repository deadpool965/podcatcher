import React from 'react';
import strings from '../../libs/language';
import './OfflineBanner.css';

function OfflineBanner() {
  return (
    <div className="offline-banner">
      {strings.appearsOffline}
      .
    </div>
  );
}

export default OfflineBanner;
