import React, { useEffect, useState } from 'react';
import Spinner from '../../components/Spinner/Spinner';
import EpisodeDescription from '../../components/EpisodeDescription/EpisodeDescription';
import SelectInput from '../../components/SelectInput/SelectInput';
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

function PodcastPage({ match }) {
  const { id } = match.params;
  const [data, setData] = useState({});
  const [episodes, setEpisodes] = useState([]);
  const [order, setOrder] = useState('DESC');
  const [limit, setLimit] = useState(50);

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

  function handleOrderChange({ target }) {
    const { value } = target;
    setOrder(value);
  }

  function handleLimitChange({ target }) {
    const { value } = target;
    setLimit(parseInt(value, 10));
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
          <div className="podcast-page__form">
          <div className="podcast-page__form__control">
              <label
                htmlFor="limit"
                className="podcast-page__form__control__label"
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
            <div className="podcast-page__form__control">
              <label
                htmlFor="order"
                className="podcast-page__form__control__label"
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
