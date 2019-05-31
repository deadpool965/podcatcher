import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Spinner from '../../components/Spinner/Spinner';
import Episode from '../../components/Episode/Episode';
import TextInput from '../../components/TextInput/TextInput';
import Grid from '../../components/Grid/Grid';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';
import Metadata from '../../components/Metadata/Metadata';
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
  const [data, setData] = useState({});
  const [episodes, setEpisodes] = useState([]);
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
    fetch(`${process.env.REACT_APP_API}podcast/${id}`)
      .then(res => res.json())
      .then((res) => {
        setData(res);
        return fetch(`${process.env.REACT_APP_API}episodes/${id}`);
      })
      .then(res => res.json())
      .then(res => setEpisodes(res));
  }, [id]);

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

  return (
    <div className="podcast-page">
      {data.collectionName && episodes.length > 0
        ? (
          <Metadata
            title={`PodCatcher - ${data.collectionName}`}
            description={`Listen to ${episodes.length} episodes of ${data.collectionName} on PodCatcher`}
          />
        )
        : null}
      <Modal
        title="Select Limit"
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
                    ariaLabel={`Show ${l} results`}
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
          <img
            className="podcast-page__summary__image-wrapper__image"
            src={data.artworkUrl600 || ''}
            alt={data.collectionName || 'Loading'}
            onLoad={onImageLoad}
          />
        </div>
        <div className="podcast-page__summary__content">
          <h2 className="podcast-page__summary__content__title">{data.collectionName || ''}</h2>
          <div className="podcast-page__summary__content__artist">{data.artistName || ''}</div>
          <div className="podcast-page__summary__content__genre">
            {data.genres ? data.genres[0] : 'Loading...'}
          </div>
        </div>
      </div>
      <div className="podcast-page__episodes">
        <div className="podcast-page__episodes__content">
          <div style={{ marginBottom: '32px' }}>
            <Grid columns="auto min-content">
              <TextInput
                id="q"
                name="q"
                ariaLabel="Search Episode"
                icon="search"
                placeholder="Search Episode"
                defaultValue={search}
                onChange={handleSearchChange}
                clearButton
                onClear={handleSearchClear}
                delayChange
              />
              <div className="podcast-page__search-tools">
                <button
                  id="limit-btn"
                  type="button"
                  className="podcast-page__search-tools__limit-btn"
                  aria-label="Limit"
                  onClick={() => setShowLimitMenu(true)}
                >
                  {limit}
                </button>
                <button
                  className="podcast-page__search-tools__order-btn"
                  type="button"
                  onClick={toggleOrder}
                  aria-label={`Order ${
                    order === 'DESC'
                      ? 'Ascending'
                      : 'Descending'
                  }`}
                >
                  <i
                    className={
                      'icon '
                      + `ion-md-arrow-round-${order === 'DESC' ? 'down' : 'up'}`
                    }
                  />
                </button>
              </div>
            </Grid>
          </div>
          <ul className="podcast-page__episode-list">
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
                    <li key={created || title}>
                      <Episode episode={episode} />
                    </li>
                  );
                })}
          </ul>
          {displayShowMoreButton
            ? (
              <div className="podcast-page__read-more">
                <Link
                  to={`/${id}/${parseInt(limit, 10) + 50}`}
                  className="podcast-page__read-more__button"
                >
                  Show More Episodes
                  <i className="podcast-page__read-more__button__icon icon ion-md-arrow-dropdown" />
                </Link>
              </div>
            )
            : null}
        </div>
      </div>
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
