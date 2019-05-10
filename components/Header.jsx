function Header() {
  return (
    <header>
      <h1>PODCATCHER</h1>
      <style jsx>
        {`
          header {
            padding: 16px 0px;
          }

          h1 {
            font-family: 'Bungee', cursive !important;
            color: var(--accent-color);
            height: 36px;
            margin: 0px;
          }
        `}
      </style>
    </header>
  );
}

export default Header