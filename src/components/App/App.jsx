import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { LastLocationProvider } from 'react-router-last-location';
import Player from '../Player/Player';
import Container from '../Container/Container';
import Header from '../Header/Header';
import UpdateAvailableToast from '../UpdateAvailableToast/UpdateAvailableToast';
import OfflineBanner from '../OfflineBanner/OfflineBanner';
import DiscoveryPage from '../../pages/Discovery/Discovery';
import PodcastPage from '../../pages/Podcast/Podcast';
import SubscriptionsPage from '../../pages/Subscriptions/Subscriptions';
import Downloads from '../../pages/Downloads/Downloads';
import Footer from '../Footer/Footer';
import Store from '../../libs/Store';
import './App.css';

function App() {
  const [tabNavigation, setTabNavigation] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

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

  useEffect(() => {
    function offline() {
      setIsOffline(true);
    }

    function online() {
      setIsOffline(false);
    }

    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    return () => {
      window.removeEventListener('online', online);
      window.removeEventListener('offline', offline);
    };
  }, [isOffline]);

  return (
    <BrowserRouter>
      <LastLocationProvider>
        <Store>
          <div className={`app
            ${tabNavigation ? '' : 'app--no-outline '}
            ${isTouch ? 'is-touch ' : 'is-not-touch '}
            ${isOffline ? 'is-offline ' : ''}`}
          >
            <UpdateAvailableToast />
            <Player />
            {isOffline
              ? <OfflineBanner />
              : null}
            <Header />
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
                    path="/subscriptions"
                    exact
                  >
                    <SubscriptionsPage />
                  </Route>
                  <Route
                    path="/downloads"
                    exact
                  >
                    <Downloads />
                  </Route>
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
      </LastLocationProvider>
    </BrowserRouter>
  );
}

export default App;
