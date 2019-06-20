import React, { useState, Fragment } from 'react';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import Grid from '../Grid/Grid';
import strings, { AVAILABLE_LANGUAGES, changeLanguage } from '../../libs/language';
import './Footer.css';

function Footer() {
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);

  function setLanguage(id) {
    changeLanguage(id);
    window.location.reload();
  }

  return (
    <Fragment>
      <Modal
        open={showLanguageDialog}
        onClose={() => setShowLanguageDialog(false)}
        title={strings.selectLanguage}
      >
        <Grid rows="auto auto">
          {AVAILABLE_LANGUAGES
            .map(({ id, value }) => (
              <Button
                key={id}
                onClick={() => setLanguage(id)}
              >
                {value}
              </Button>
            ))}
        </Grid>
      </Modal>
      <footer
        className="footer"
        role="complementary"
        aria-label="Footer Links"
      >
        <Button
          accentText
          transparent
          small
          onClick={() => setShowLanguageDialog(true)}
        >
          {strings.selectLanguage}
        </Button>
        <br />
        <br />
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
    </Fragment>
  );
}

export default Footer;
