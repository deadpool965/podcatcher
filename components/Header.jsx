function Header() {
  return (
    <header>
      <h1>PODCATCHER</h1>
      <style jsx>
        {`
          h1 {
            font-family: 'Bungee', cursive !important;
            color: var(--accent-color);
            height: 36px;
            padding-top: 16px;
            padding-bottom: 8px;
          }
        `}
      </style>
    </header>
  );
}

export default Header