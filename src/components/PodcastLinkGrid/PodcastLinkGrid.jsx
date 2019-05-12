import React from 'react';
import PropTypes from 'prop-types';
import './PodcastLinkGrid.css';

function PodcastLinkGrid({ podcasts }) {
  function onImageLoad(e) {
    const image = e.target;
    image.className += ' podcast-link-item__img--loaded';
  }

  return (
    <div className="podcast-link-grid">
      {
        podcasts
          .map(({
            id,
            name,
            artworkUrl100,
          }) => (
            <a
              key={id}
              href={`/${id}`}
              className="podcast-link-item"
            >
              <img
                className="podcast-link-item__img"
                src={artworkUrl100}
                alt={name}
                onLoad={onImageLoad}
              />
              <span className="podcast-link-item__hidden-text">{name}</span>
            </a>
          ))
      }
    </div>
  );
}

PodcastLinkGrid.propTypes = {
  podcasts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      artworkUrl100: PropTypes.string,
    }),
  ).isRequired,
};

export default PodcastLinkGrid;
