import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Container from '../Container/Container';
import Header from '../Header/Header';
import DiscoveryPage from '../../pages/Discovery/Discovery';
import PodcastPage from '../../pages/Podcast/Podcast';
import Footer from '../Footer/Footer';
import Store from '../../libs/Store';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Store>
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
              <Route
                path="/:id/:limit?"
                exact
                render={props => <PodcastPage {...props} />}
              />
            </main>
          </Container>
          <Footer />
        </div>
      </Store>
    </BrowserRouter>
  );
}

export default App;
