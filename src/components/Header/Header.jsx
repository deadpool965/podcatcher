import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header
      className="header"
      role="navigation"
      aria-label="Header"
    >
      <Link
        to="/"
        className="header__title"
      >
        <h1 className="header__title__h1">PODCATCHER</h1>
      </Link>
    </header>
  );
}

export default Header;
