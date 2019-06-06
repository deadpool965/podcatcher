import React from 'react';
import ReactDOM from 'react-dom';
import 'intersection-observer';
import './index.css';
import App from './components/App/App';

ReactDOM.render(<App />, document.getElementById('root'));

window.addEventListener('load', () => {
  const styles = [
    'https://fonts.googleapis.com/css?family=Bungee&font-display=swap',
    'https://unpkg.com/ionicons@4.5.5/dist/css/ionicons.min.css',
  ];
  styles.forEach((src) => {
    const $link = document.createElement('link');
    $link.href = src;
    $link.rel = 'stylesheet';
    document.head.appendChild($link);
  });
});

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  navigator
    .serviceWorker
    .register('/sw.js')
    .then((reg) => {
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;

        newWorker.addEventListener('statechange', () => {
          if (
            newWorker.state === 'installed'
            && navigator.serviceWorker.controller
          ) {
            window.dispatchEvent(new CustomEvent('update-available'));
          }
        });

        window.addEventListener('update-requested', () => {
          newWorker.postMessage({ action: 'skipWaiting' });
        });
      });
    });

  let refreshing = false;
  navigator
    .serviceWorker
    .addEventListener('controllerchange', () => {
      if (refreshing) return;
      window.location.reload();
      refreshing = true;
    });
}
