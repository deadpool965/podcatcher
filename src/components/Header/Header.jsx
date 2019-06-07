import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Container from '../Container/Container';
import './Header.css';

function Header({
  location,
}) {
  const [showBackButton, setShowBackButton] = useState(false);

  useEffect(() => {
    setShowBackButton(location.pathname !== '/');
  }, [location.pathname]);

  return (
    <header
      className="header"
      role="navigation"
      aria-label="Header"
    >
      <Container>
        <h1 className="header__title">PODCATCHER</h1>
      </Container>
      {
        showBackButton
          ? (
            <div className="nav">
              <Container>
                <ul className="nav__list">
                  <li className="nav__list-item">
                    <Link
                      to="/"
                      className="nav__link"
                    >
                      <i
                        className="icon ion-ios-arrow-back"
                        aria-hidden
                        style={{ marginRight: '6px' }}
                      />
                      Return
                    </Link>
                  </li>
                  <li />
                </ul>
              </Container>
            </div>
          ) : null
      }
    </header>
  );
}

Header.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};

export default Header;
