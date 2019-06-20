import React, {
  useEffect,
  useState,
  useContext,
} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Spinner from '../../components/Spinner/Spinner';
import Episode from '../../components/Episode/Episode';
import TextInput from '../../components/TextInput/TextInput';
import Grid from '../../components/Grid/Grid';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';
import Metadata from '../../components/Metadata/Metadata';
import OfflineAlert from '../../components/OfflineAlert/OfflineAlert';
import api from '../../libs/api';
import { PodcastDataContext } from '../../libs/Store';
import strings from '../../libs/language';
import './Podcast.css';

const LIMIT_OPTIONS = [
  10,
  25,
  50,
  100,
];

const EQUALIZER_REG_EXP = /[^a-zA-Z0-9 ]/gi;

function PodcastPage({
  match,
  history,
}) {
  const { id } = match.params;
  const [search, setSearch] = useState('');
  const [data, setData] = useContext(PodcastDataContext);
  const [dataError, setDataError] = useState(false);
  const [episodes, setEpisodes] = useState([]);
  const [episodesError, setEpisodesError] = useState(false);
  const [order, setOrder] = useState('DESC');
  const [showLimitMenu, setShowLimitMenu] = useState(false);
  const limit = match.params.limit || '25';
  const displayShowMoreButton = Number.isNaN(limit)
    || episodes.length > parseInt(limit, 10);

  const searchQuery = search
    .replace(EQUALIZER_REG_EXP, '')
    .normalize('NFD')
    .toLowerCase()
    .trim();

  useEffect(() => {
    setData({});
    api(`podcast/${id}`)
      .then((res) => {
        setData(res);
        api(`episodes/${id}`)
          .then(e => setEpisodes(e))
          .catch(() => setEpisodesError(true));
      })
      .catch(() => setDataError(true));
  }, [id, setData]);

  function onImageLoad({ target }) {
    const image = target;
    image.className += ' podcast-page__summary__image-wrapper__image--loaded';
  }

  function toggleOrder() {
    setOrder(order === 'DESC' ? 'ASC' : 'DESC');
  }

  function handleSearchChange({ target }) {
    const { value } = target;
    setSearch(value);
  }

  function handleSearchClear() {
    setSearch('');
  }

  function onLimitDialogClose() {
    setShowLimitMenu(false);
    document.getElementById('limit-btn').focus();
  }

  function changeLimit(l) {
    history.push(`/${id}/${l}`);
    onLimitDialogClose();
  }

  const genre = () => {
    if (dataError) {
      return 'Try again later';
    }

    return data.genres ? data.genres[0] : 'Loading...';
  };

  return (
    <div className="podcast-page">
      {data.collectionName && episodes.length > 0
        ? (
          <Metadata
            title={`PodCatcher - ${data.collectionName}`}
            description={strings.formatString(strings.podcastMetaDescription, episodes.length, data.collectionName)}
          />
        )
        : null}
      <Modal
        title={strings.selectLimit}
        onClose={onLimitDialogClose}
        open={showLimitMenu}
      >
        <ul className="podcast-page__limit-list">
          {
            LIMIT_OPTIONS
              .map(l => (
                <li key={l}>
                  <Button
                    type="button"
                    onClick={() => changeLimit(l)}
                    fullWidth
                    ariaLabel={strings.formatString(strings.showXResults, l)}
                  >
                    {l}
                  </Button>
                </li>
              ))
          }
        </ul>
      </Modal>
      <div className="podcast-page__summary">
        <div className="podcast-page__summary__image-wrapper">
          {dataError
            ? <i className="icon ion-ios-wifi" aria-hidden />
            : (
              <img
                className="podcast-page__summary__image-wrapper__image"
                src={data.artworkUrl600 || ''}
                alt={data && data.collectionName ? strings.formatString(strings.logoOfX, data.collectionName) : strings.loadingImage}
                onLoad={onImageLoad}
              />
            )}
        </div>
        <div className="podcast-page__summary__content">
          <h2 className="podcast-page__summary__content__title">
            {dataError
              ? 'Oops!'
              : data.collectionName || ''}
          </h2>
          <div className="podcast-page__summary__content__artist">
            {dataError
              ? 'Sorry, something went wrong. We could not reach the network'
              : data.artistName || ''}
          </div>
          <div className="podcast-page__summary__content__genre">
            {genre()}
          </div>
        </div>
      </div>
      {dataError
        ? null
        : (
          <div className="podcast-page__episodes">
            <div className="podcast-page__episodes__content">
              <form
                style={{ marginBottom: '32px' }}
                aria-label={strings.searchForEpisodes}
              >
                <Grid columns="auto min-content">
                  <TextInput
                    id="q"
                    name="q"
                    ariaLabel={strings.searchEpisode}
                    icon="search"
                    placeholder={strings.searchEpisode}
                    defaultValue={search}
                    onChange={handleSearchChange}
                    clearButton
                    onClear={handleSearchClear}
                    delayChange
                  />
                  <div className="podcast-page__search-tools">
                    <Button
                      id="limit-btn"
                      aria-label={strings.changeLimit}
                      onClick={() => setShowLimitMenu(true)}
                      transparent
                      lightText
                      circle
                    >
                      {limit}
                    </Button>
                    <Button
                      id="order-btn"
                      onClick={toggleOrder}
                      aria-label={strings.changeOrder}
                      transparent
                      lightText
                      circle
                    >
                      <i
                        className={
                          'icon '
                          + `ion-md-arrow-round-${order === 'DESC' ? 'down' : 'up'}`
                        }
                        aria-hidden
                      />
                    </Button>
                  </div>
                </Grid>
              </form>
              {episodesError
                ? <OfflineAlert />
                : (
                  <ul
                    className="podcast-page__episode-list"
                    aria-label={strings.podcastEpisodes}
                  >
                    {episodes.length === 0
                      ? <Spinner />
                      : episodes
                        .sort((a, b) => {
                          const createdA = new Date(a.created);
                          const createdB = new Date(b.created);

                          if (order === 'ASC') {
                            return createdA - createdB;
                          }

                          return createdB - createdA;
                        })
                        .filter((e) => {
                          if (search === '') return true;

                          const title = e.title
                            .normalize('NFD')
                            .replace(EQUALIZER_REG_EXP, '')
                            .toLowerCase()
                            .trim();

                          if (title.indexOf(searchQuery) !== -1) {
                            return true;
                          }

                          return false;
                        })
                        .filter((e, i) => {
                          if (Number.isNaN(parseFloat(limit))) return true;
                          return i < parseInt(limit, 10);
                        })
                        .map((episode) => {
                          const { title, created } = episode;
                          return (
                            <li
                              key={created || title}
                              aria-label={title}
                            >
                              <Episode
                                episode={episode}
                                podcast={data}
                              />
                            </li>
                          );
                        })}
                  </ul>
                )}
              {displayShowMoreButton
                ? (
                  <div className="podcast-page__read-more">
                    <Link
                      to={`/${id}/${parseInt(limit, 10) + 50}`}
                      className="podcast-page__read-more__button"
                    >
                      {strings.showMoreEpisodes}
                      <i className="podcast-page__read-more__button__icon icon ion-md-arrow-dropdown" />
                    </Link>
                  </div>
                )
                : null}
            </div>
          </div>
        )}
    </div>
  );
}

PodcastPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default PodcastPage;
