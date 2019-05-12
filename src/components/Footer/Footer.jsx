import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      2019 - PodCatcher
      <br />
      Created by
      <a
        href="https://thallesmaia.com/about-me"
        target="_blank"
        rel="noopener noreferrer"
        className="footer__link"
      >
        Thalles Maia
      </a>
      <br />
      This is an
      <a
        href="https://github.com/tmaiadev/podcatcher"
        target="_blank"
        rel="noopener noreferrer"
        className="footer__link"
      >
        open source
      </a>
      project
    </footer>
  );
}

export default Footer;
