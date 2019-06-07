import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Player from '../Player/Player';
import Container from '../Container/Container';
import Header from '../Header/Header';
import UpdateAvailableToast from '../UpdateAvailableToast/UpdateAvailableToast';
import DiscoveryPage from '../../pages/Discovery/Discovery';
import PodcastPage from '../../pages/Podcast/Podcast';
import InstallIOS from '../../pages/InstallIOS/InstallIOS';
import Footer from '../Footer/Footer';
import Store from '../../libs/Store';
import './App.css';

function App() {
  const [tabNavigation, setTabNavigation] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    function enableTabNavigation({ key }) {
      if (key !== 'Tab' || tabNavigation === true) return;
      setTabNavigation(true);
    }

    function disableTabNavigation() {
      if (tabNavigation === false) return;
      setTabNavigation(false);
    }

    function touchNavigation() {
      disableTabNavigation();
      if (isTouch === true) return;
      setIsTouch(true);
    }

    document.addEventListener('keydown', enableTabNavigation);
    document.addEventListener('mousemove', disableTabNavigation);
    document.addEventListener('touchstart', touchNavigation);

    return () => {
      document.removeEventListener('keydown', enableTabNavigation);
      document.removeEventListener('mousemove', disableTabNavigation);
      document.removeEventListener('touchstart', disableTabNavigation);
    };
  }, [tabNavigation, isTouch]);

  return (
    <BrowserRouter>
      <Store>
        <div className={`app
          ${tabNavigation ? '' : 'app--no-outline'}
          ${isTouch ? 'is-touch' : 'is-not-touch'}`}
        >
          <UpdateAvailableToast />
          <Player />
          <Route
            path="/"
            render={props => <Header {...props} />}
          />
          <Container>
            <main
              className="app__main"
              role="main"
            >
              <Switch>
                <Route
                  path="/"
                  exact
                  render={props => <DiscoveryPage {...props} />}
                />
                <Route
                  path="/install-ios"
                  exact
                  render={() => <InstallIOS />}
                />
                <Route
                  path="/:id/:limit?"
                  exact
                  render={props => <PodcastPage {...props} />}
                />
              </Switch>
            </main>
          </Container>
          <Footer />
        </div>
      </Store>
    </BrowserRouter>
  );
}

export default App;
