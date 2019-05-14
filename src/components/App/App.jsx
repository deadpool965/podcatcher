import React from 'react';
import Container from '../Container/Container';
import { BrowserRouter, Route } from 'react-router-dom';
import Header from '../Header/Header';
import DiscoveryPage from '../../pages/Discovery/Discovery';
import Footer from '../Footer/Footer';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Container>
          <Header />
        </Container>
        <Container>
          <main className="app__main">
            <Route
              path="/"
              exact
              render={props => <DiscoveryPage {...props} />}
            />
          </main>
        </Container>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
