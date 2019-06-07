import React from 'react';
import Container from '../Container/Container';
import Nav from '../Nav/Nav';
import './Header.css';

function Header() {
  return (
    <header
      className="header"
      role="navigation"
      aria-label="Header"
    >
      <Container>
        <h1 className="header__title">PODCATCHER</h1>
      </Container>
      <Nav />
    </header>
  );
}

export default Header;
