import React, { useEffect, useState } from 'react';
import Spinner from '../../components/Spinner/Spinner';
import EpisodeDescription from '../../components/EpisodeDescription/EpisodeDescription';
import SelectInput from '../../components/SelectInput/SelectInput';
import TextInput from '../../components/TextInput/TextInput';
import Grid from '../../components/Grid/Grid';
import './Podcast.css';

const ORDER_OPTIONS = [
  { label: 'Ascending', value: 'ASC' },
  { label: 'Descending', value: 'DESC' },
];

const LIMIT_OPTIONS = [
  { label: '10', value: '10' },
  { label: '25', value: '25' },
  { label: '50', value: '50' },
  { label: '75', value: '75' },
  { label: '100', value: '100' },
  { label: '150', value: '150' },
  { label: '200', value: '200' },
  { label: '250', value: '250' },
  { label: '500', value: '500' },
  { label: '1000', value: '1000' },
];

const EQUALIZER_REG_EXP = /[^a-zA-Z0-9 ]/gi;

function PodcastPage({ match }) {
  const { id } = match.params;
  const [search, setSearch] = useState('');
  const [data, setData] = useState({});
  const [episodes, setEpisodes] = useState([]);
  const [order, setOrder] = useState('DESC');
  const [limit, setLimit] = useState(50);

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

  function handleSearchChange({ target }) {
    const { value } = target;
    setSearch(value);
  }

  function handleOrderChange({ target }) {
    const { value } = target;
    setOrder(value);
  }

  function handleLimitChange({ target }) {
    const { value } = target;
    setLimit(parseInt(value, 10));
  }

  function handleSearchClear() {
    setSearch('');
  }

  return (
    <div className="podcast-page">
      <div className="podcast-page__summary">
        <div className="podcast-page__summary__image-wrapper">
          <img
            className="podcast-page__summary__image-wrapper__image"
            src={data.artworkUrl600 || ''}
            alt={data.title || 'Loading'}
            onLoad={onImageLoad}
          />
        </div>
        <div className="podcast-page__summary__content">
          <h2 className="podcast-page__summary__content__title">{data.collectionName || ''}</h2>
          <div className="podcast-page__summary__content__artist">{data.artistName || ''}</div>
          <div className="podcast-page__summary__content__genre">{data.genres ? data.genres[0] : 'Loading...'}</div>
        </div>
      </div>
      <div className="podcast-page__episodes">
        <div className="podcast-page__episodes__side" />
        <div className="podcast-page__episodes__content">
          <Grid rows="auto auto">
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
            />
            <Grid columns="1fr 1fr">
              <div className="podcast-page__form-control">
                <label
                  htmlFor="limit"
                  className="podcast-page__form-control__label"
                >
                  Limit:
                </label>
                <SelectInput
                  id="limit"
                  name="limit"
                  ariaLabel="Limit"
                  defaultValue={`${limit}`}
                  options={LIMIT_OPTIONS}
                  onChange={handleLimitChange}
                />
              </div>
              <div className="podcast-page__form-control">
                <label
                  htmlFor="order"
                  className="podcast-page__form-control__label"
                >
                  Order:
                </label>
                <SelectInput
                  id="order"
                  name="order"
                  ariaLabel="Order"
                  defaultValue={order}
                  options={ORDER_OPTIONS}
                  onChange={handleOrderChange}
                />
              </div>
            </Grid>
          </Grid>
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
                .filter((e, i) => i < limit)
                .map(({
                  title,
                  created,
                  description,
                }) => (
                    <li className="podcast-page__episode" key={title}>
                      <div className="podcast-page__episode__release-date">
                        {(new Date(created)).toGMTString()}
                      </div>
                      <h3 className="podcast-page__episode__title">
                        {title}
                      </h3>
                      <EpisodeDescription
                        text={description}
                      />
                    </li>
                  ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PodcastPage;
