import React from 'react';
import strings from '../../libs/language';
import './Footer.css';

function Footer() {
  return (
    <footer
      className="footer"
      role="complementary"
      aria-label="Footer Links"
    >
      2019 - PodCatcher
      <br />
      {strings.createdBy}
      <a
        href="https://thallesmaia.com/about-me"
        target="_blank"
        rel="noopener noreferrer"
        className="footer__link"
      >
        Thalles Maia
      </a>
      <br />
      {
        strings
          .formatString(
            strings.thisIsAnXProject,
            (
              <a
                href="https://github.com/tmaiadev/podcatcher"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__link"
              >
                {strings.openSource}
              </a>
            ),
          )
      }
    </footer>
  );
}

export default Footer;
