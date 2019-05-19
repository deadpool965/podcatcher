import React from 'react';
import ReactDOM from 'react-dom';
import 'intersection-observer';
import './index.css';
import App from './components/App/App';
import * as serviceWorker from './serviceWorker';

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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
