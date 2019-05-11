import React from 'react';
import './PodcastLinkGrid.css';

function PodcastLinkGrid({ podcasts }) {
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
                />
                <span className="podcast-link-item__hidden-text">{name}</span>
              </a>
          ))
      }
    </div>
  );
}

export default PodcastLinkGrid;
