import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './PodcastGrid.css';

function onImageLoad(e) {
  const image = e.target;
  image.className += ' podcast-link-item__img--loaded';
}

const observerCallback = (entries) => {
  entries
    .forEach(({
      intersectionRatio,
      target,
    }) => {
      const image = target;
      if (image.src || intersectionRatio <= 0) return;
      image.onload = onImageLoad;
      image.setAttribute('src', image.getAttribute('data-src'));
    });
};

const observer = new IntersectionObserver(observerCallback, {
  root: null,
  rootMargin: '0px',
  threshold: 0.1,
});

function PodcastGrid({ podcasts }) {
  useEffect(() => {
    Array.from(
      document
        .querySelectorAll('.podcast-link-grid .podcast-link-item__img'),
    )
      .forEach($img => observer.observe($img));
  }, [podcasts]);

  return (
    <div className="podcast-link-grid">
      {
        podcasts
          .map(({
            id,
            name,
            artworkUrl100,
          }) => (
            <Link
              key={id}
              to={`/${id}`}
              className="podcast-link-item"
            >
              <img
                className="podcast-link-item__img"
                data-src={artworkUrl100}
                alt={name || 'Loading'}
              />
              <span className="podcast-link-item__hidden-text">{name}</span>
            </Link>
          ))
      }
    </div>
  );
}

PodcastGrid.propTypes = {
  podcasts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      artworkUrl100: PropTypes.string,
    }),
  ).isRequired,
};

export default PodcastGrid;
