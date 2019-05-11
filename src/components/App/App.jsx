import React from 'react';
import Container from '../Container/Container';
import Header from '../Header/Header';
import DiscoveryPage from '../../pages/Discovery/Discovery';
import './App.css';

function App() {
  return (
    <div className="app">
      <Container>
        <Header />
      </Container>
      <Container>
        <main className="app__main">
          <DiscoveryPage />
        </main>
      </Container>
    </div>
  );
}

export default App;
