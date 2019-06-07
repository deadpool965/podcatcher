import React, { useContext } from 'react';
import {
  Route,
  NavLink,
  Link,
} from 'react-router-dom';
import { useLastLocation } from 'react-router-last-location';
import Container from '../Container/Container';
import Grid from '../Grid/Grid';
import Button from '../Button/Button';
import {
  SubscriptionsContext,
  PodcastDataContext,
  SUBSCRIPTIONS_ACTION_TYPE,
} from '../../libs/Store';
import './Nav.css';

function Nav() {
  const [podcastData] = useContext(PodcastDataContext);
  const [subscriptions, dispatchSubscriptions] = useContext(SubscriptionsContext);

  function subscribe() {
    dispatchSubscriptions({
      type: SUBSCRIPTIONS_ACTION_TYPE.SUBSCRIBE,
      payload: {
        id: `${podcastData.collectionId}`,
        name: podcastData.collectionName,
        artworkUrl100: podcastData.artworkUrl100,
      },
    });
  }

  function unsubscribe() {
    dispatchSubscriptions({
      type: SUBSCRIPTIONS_ACTION_TYPE.UNSUBSCRIBE,
      payload: `${podcastData.collectionId}`,
    });
  }

  const subscribed = Boolean(
    subscriptions
      .find(({ id }) => id === `${podcastData.collectionId}`),
  );

  const lastLocation = useLastLocation();

  return (
    <nav className="nav">
      <Route
        path="/:page?"
        render={({ match }) => {
          switch (true) {
            case match.params.page === undefined
              || match.params.page === 'subscriptions': // HOME / SUBSCRIPTIONS
              return (
                <Container noPadding>
                  <Grid
                    columns="1fr 1fr"
                    style={{ gridGap: '0px' }}
                  >
                    <NavLink
                      to="/"
                      exact
                      className="nav__tab-item"
                      activeClassName="nav__tab-item--active"
                    >
                      Discover
                    </NavLink>
                    <NavLink
                      to="/subscriptions"
                      exact
                      className="nav__tab-item"
                      activeClassName="nav__tab-item--active"
                    >
                      Subscriptions
                    </NavLink>
                  </Grid>
                </Container>
              );
            case /^\d+$/.test(match.params.page): // PODCAST PAGE
              return (
                <Container>
                  <Grid columns="min-content auto min-content">
                    <Link
                      to={lastLocation || '/'}
                      className="nav__link-item"
                    >
                      <i
                        aria-hidden
                        className="icon ion-ios-arrow-back"
                        style={{ marginRight: '8px' }}
                      />
                      Return
                    </Link>
                    <div />
                    <div className="nav__center">
                      {
                        subscribed
                          ? (
                            <Button
                              onClick={unsubscribe}
                              transparent
                              accentText
                              pointy
                            >
                              <i
                                aria-hidden
                                className="icon ion-md-heart-dislike"
                                style={{ marginRight: '8px' }}
                              />
                              Unsubscribe
                            </Button>
                          )
                          : (
                            <Button
                              onClick={subscribe}
                              transparent
                              accentText
                              pointy
                            >
                              <i
                                aria-hidden
                                className="icon ion-md-heart"
                                style={{ marginRight: '8px' }}
                              />
                              Subscribe
                            </Button>
                          )
                      }
                    </div>
                  </Grid>
                </Container>
              );
            default: // ANY OTHER PAGE
              return (
                <Container>
                  <Grid columns="min-content auto">
                    <Link
                      to={lastLocation || '/'}
                      className="nav__link-item"
                    >
                      <i
                        aria-hidden
                        className="icon ion-ios-arrow-back"
                        style={{ marginRight: '8px' }}
                      />
                      Return
                    </Link>
                    <div />
                  </Grid>
                </Container>
              );
          }
        }}
      />
    </nav>
  );
}

export default Nav;
