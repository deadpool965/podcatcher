import React, { useEffect, useState, useRef } from 'react';
import { render } from 'react-dom';
import Linkify from 'react-linkify';
import Spinner from '../../components/Spinner/Spinner';
import './Podcast.css';

const observer = new IntersectionObserver((entries) => {
  entries
    .map(({
      target,
      intersectionRatio,
    }) => {
      const parsed = target.getAttribute('parsed');
      if (intersectionRatio === 0 || parsed) return;
      target.setAttribute('parsed', 1);
      requestAnimationFrame(() => {
        render(<Linkify>{target.textContent}</Linkify>, target);
      });
    });
}, {
  threshold: 0.001,
});

function Description({ text }) {
  const [data, setData] = useState(text);
  const item = useRef();

  useEffect(() => {
    observer.observe(item.current);
  }, []);

  return (
    <div ref={item} className="podcast-page__episode__description">
      {data}
    </div>
  );
}

function PodcastPage({ match }) {
  const { id } = match.params;
  const [data, setData] = useState({});
  const [episodes, setEpisodes] = useState([]);
  const [order, setOrder] = useState('ASC');
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
          <ul className="podcast-page__episode-list">
            {episodes.length === 0
              ? <Spinner />
              : episodes
                .sort((a, b) => {
                  const createdA = new Date(a.created);
                  const createdB = new Date(b.created);
                  if (order === 'ASC') {
                    return createdA > createdB;
                  }

                  return createdA < createdB;
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
                    <Description text={description} />
                  </li>
                ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PodcastPage;
